import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { load } from "cheerio";
import { afterAll, beforeAll, describe, expect, test } from "vite-plus/test";
import baseline from "./fixtures/migration-baseline.json" with { type: "json" };
import { pageFingerprint } from "./page-fingerprint.ts";
import { startProductionServer } from "./production-server.ts";
import { sources } from "../data/sources.ts";

const executeFile = promisify(execFile);
const PAGES = {
	home: "/",
	primary: "/?masodlagos=false",
	all: "/?harmadlagos=true",
	about: "/rolunk",
	validation: "/kriptovalidalas",
	votes: "/szavazas",
	county: "/szavazas?megye=Budapest&kerulet=01",
	source: "/forras/etoro-email-visszateres",
};

let server: Awaited<ReturnType<typeof startProductionServer>>;
beforeAll(async () => {
	server = await startProductionServer();
}, 20000);
afterAll(async () => {
	await server?.stop();
});

describe("production page parity", () => {
	for (const [name, path] of Object.entries(PAGES)) {
		for (const lang of ["hu", "en"] as const) {
			test(`${name} (${lang}) matches the pre-migration production site`, async () => {
				const response = await fetch(`${server.baseUrl}${path}`, { headers: { cookie: `lang=${lang}` } });
				expect(response.status).toBe(200);
				const html = await response.text();
				const fingerprint = createHash("sha256")
					.update(JSON.stringify(pageFingerprint(html)))
					.digest("hex");
				expect(fingerprint).toBe(baseline[`${name}-${lang}` as keyof typeof baseline]);
				const $ = load(html);
				expect($("html").attr("lang")).toBe(lang);
				expect($("head title")).toHaveLength(1);
				if (name !== "source") {
					const jsonLd = JSON.parse($("head script[type='application/ld+json']").text());
					expect(jsonLd["@context"]).toBe("https://schema.org");
					expect(jsonLd["@graph"][0]["@type"]).toBe("WebSite");
				}
			});
		}
	}
});

test("request language is isolated between concurrent requests", async () => {
	const languages = ["en", "hu", "en", "hu", "en", "hu"];
	const responses = await Promise.all(
		languages.map(async (lang) => {
			const response = await fetch(server.baseUrl, { headers: { cookie: `lang=${lang}` } });
			return load(await response.text())("html").attr("lang");
		}),
	);
	expect(responses).toEqual(languages);
});

test("cookie language overrides Accept-Language, with a Hungarian fallback", async () => {
	for (const [headers, expected] of [
		[{ "accept-language": "en-US" }, "en"],
		[{ "accept-language": "de-DE" }, "hu"],
		[{ cookie: "lang=hu", "accept-language": "en-US" }, "hu"],
		[{ cookie: "lang=en", "accept-language": "hu-HU" }, "en"],
		[{ cookie: "lang=invalid", "accept-language": "en-US" }, "en"],
	] as const) {
		const response = await fetch(server.baseUrl, { headers });
		expect(load(await response.text())("html").attr("lang")).toBe(expected);
	}
});

test("language switching preserves the local path, query, fragment and one-year cookie", async () => {
	const path = "/szavazas?megye=Budapest&kerulet=01#szavazas";
	const response = await fetch(`${server.baseUrl}/set-lang?lang=en&redirect=${encodeURIComponent(path)}`, {
		redirect: "manual",
	});
	expect(response.status).toBe(302);
	expect(response.headers.get("location")).toBe(path);
	expect(response.headers.get("set-cookie")).toBe("lang=en; Path=/; Max-Age=31536000; SameSite=Lax");
	const invalid = await fetch(`${server.baseUrl}/set-lang?lang=invalid`, { redirect: "manual" });
	expect(invalid.headers.get("set-cookie")).toBeNull();
	for (const target of ["https://example.com", "//example.com", "\\\\example.com", "http://["]) {
		const external = await fetch(`${server.baseUrl}/set-lang?lang=hu&redirect=${encodeURIComponent(target)}`, {
			redirect: "manual",
		});
		expect(external.headers.get("location")).toBe("/");
	}
});

test("all source routes enforce first-party visibility and missing routes return 404", async () => {
	for (const [slug, source] of Object.entries(sources)) {
		const response = await fetch(`${server.baseUrl}/forras/${slug}`);
		expect(response.status, slug).toBe(source.originalUrl || source.internalUrl ? 404 : 200);
	}
	for (const path of ["/nincs-ilyen-oldal", "/forras/nincs-ilyen-forras"]) {
		expect((await fetch(`${server.baseUrl}${path}`)).status).toBe(404);
	}
}, 20000);

test("sitemap has the existing public routes, language alternates and cache headers", async () => {
	const response = await fetch(`${server.baseUrl}/sitemap.xml`);
	expect(response.status).toBe(200);
	expect(response.headers.get("content-type")).toContain("application/xml");
	expect(response.headers.get("cache-control")).toBe("public, max-age=86400");
	const $ = load(await response.text(), { xml: true });
	expect($("url")).toHaveLength(4);
	expect($("xhtml\\:link")).toHaveLength(12);
});

test("every published static asset is served byte-for-byte", async () => {
	async function checkDirectory(directory: string): Promise<void> {
		const entries = await readdir(`static/${directory}`, { withFileTypes: true });
		await Promise.all(
			entries.map(async (entry) => {
				const relative = `${directory}${entry.name}`;
				if (entry.isDirectory()) return checkDirectory(`${relative}/`);
				const response = await fetch(`${server.baseUrl}/${relative}`);
				expect(response.status, relative).toBe(200);
				expect(Buffer.from(await response.arrayBuffer()), relative).toEqual(await readFile(`static/${relative}`));
			}),
		);
	}
	await checkDirectory("");
}, 20000);

test("maintenance scripts use Node.js without posting or writing data", async () => {
	for (const script of ["inspect-current-winners", "backfill-mps-kpn-ids"]) {
		const result = await executeFile(process.execPath, [`scripts/${script}.ts`, "--help"]);
		expect(result.stdout).toContain("Usage:");
		expect(result.stdout).toContain("pnpm");
	}
	const sentBefore = await readFile("data/sent-telegram-events.json", "utf8");
	const preview = await executeFile(process.execPath, ["scripts/post-telegram.ts", "--dry-run"]);
	expect(preview.stdout).toMatch(/\[DRY-RUN\]/);
	expect(await readFile("data/sent-telegram-events.json", "utf8")).toBe(sentBefore);
});
