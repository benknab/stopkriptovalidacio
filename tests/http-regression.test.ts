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
import { localizePath } from "../utils/localized-path.ts";
import { PUBLIC_PAGE_PATHS, STATIC_PAGE_PATHS } from "../utils/static-pages.ts";
import { SITE_URL } from "../constants/seo.ts";

const executeFile = promisify(execFile);
const PAGES = {
	home: "/",
	about: "/rolunk",
	validation: "/kriptovalidalas",
	votes: "/szavazas",
	source: "/forras/etoro-email-visszateres",
};

let server: Awaited<ReturnType<typeof startProductionServer>>;
beforeAll(async () => {
	server = await startProductionServer();
}, 30000);
afterAll(async () => {
	await server?.stop();
});

describe("production page parity", () => {
	for (const [name, path] of Object.entries(PAGES)) {
		for (const lang of ["hu", "en"] as const) {
			test(`${name} (${lang}) matches the pre-migration production site`, async () => {
				const response = await fetch(`${server.baseUrl}${localizePath(path, lang)}`);
				expect(response.status).toBe(200);
				const html = await response.text();
				const fingerprint = createHash("sha256")
					.update(JSON.stringify(pageFingerprint(html)))
					.digest("hex");
				expect(fingerprint).toBe(baseline[`${name}-${lang}` as keyof typeof baseline]);
				const $ = load(html);
				expect($("html").attr("lang")).toBe(lang);
				expect($("head title")).toHaveLength(1);
				expect($("link[rel=canonical]").attr("href")).toBe(`${SITE_URL}${localizePath(path, lang)}`);
				expect($("link[hreflang=en]").attr("href")).toBe(`${SITE_URL}${localizePath(path, "en")}`);
				expect($("link[hreflang=hu]").attr("href")).toBe(`${SITE_URL}${localizePath(path, "hu")}`);
				if (name !== "source") {
					const jsonLd = JSON.parse($("head script[type='application/ld+json']").text());
					expect(jsonLd["@context"]).toBe("https://schema.org");
					expect(jsonLd["@graph"][0]["@type"]).toBe("WebSite");
				}
			});
		}
	}
});

test("every exported page and language alternate has a self-canonical URL without redirects", async () => {
	const exportedUrls = new Set(STATIC_PAGE_PATHS.map((path) => `${SITE_URL}${path}`));
	for (const path of STATIC_PAGE_PATHS) {
		const response = await fetch(`${server.baseUrl}${path}`, { redirect: "manual" });
		expect(response.status, path).toBe(200);
		const $ = load(await response.text());
		expect($("link[rel=canonical]")).toHaveLength(1);
		expect($("link[rel=canonical]").attr("href"), path).toBe(`${SITE_URL}${path}`);
		if ($("meta[property='og:url']").length)
			expect($("meta[property='og:url']").attr("content")).toBe(`${SITE_URL}${path}`);
		expect($("link[rel=alternate]")).toHaveLength(3);
		for (const element of $("link[rel=alternate]").toArray()) {
			const href = $(element).attr("href") ?? "";
			expect(exportedUrls.has(href), `${path} has a redirecting or unexported alternate: ${href}`).toBe(true);
		}
	}
});

test("legacy slashless URLs redirect permanently without losing encoded query parameters", async () => {
	const query = "?utm_source=regression&megye=B%C3%A9k%C3%A9s&kerulet=01";
	for (const path of STATIC_PAGE_PATHS.filter((path) => path !== "/")) {
		const response = await fetch(`${server.baseUrl}${path.slice(0, -1)}${query}`, { redirect: "manual" });
		expect([301, 308], path).toContain(response.status);
		const location = new URL(response.headers.get("location") ?? "", server.baseUrl);
		expect(location.pathname).toBe(path);
		expect(location.search).toBe(query);
	}
});

test("language is isolated between concurrently requested static URLs", async () => {
	const languages = ["en", "hu", "en", "hu", "en", "hu"] as const;
	const responses = await Promise.all(
		languages.map(async (lang) => {
			const response = await fetch(`${server.baseUrl}${localizePath("/", lang)}`);
			return load(await response.text())("html").attr("lang");
		}),
	);
	expect(responses).toEqual(languages);
});

test("static documents depend only on path, not cookies, headers or query filters", async () => {
	for (const page of PUBLIC_PAGE_PATHS) {
		for (const lang of ["hu", "en"] as const) {
			const path = localizePath(page, lang);
			const plain = await (await fetch(`${server.baseUrl}${path}`)).text();
			const response = await fetch(`${server.baseUrl}${path}?masodlagos=false&harmadlagos=true`, {
				headers: { cookie: `lang=${lang === "hu" ? "en" : "hu"}`, "accept-language": "en-US" },
			});
			expect(await response.text()).toBe(plain);
			expect(response.headers.get("set-cookie")).toBeNull();
		}
	}
});

test("every public page is real build-time HTML and needs no runtime server functions", async () => {
	for (const path of STATIC_PAGE_PATHS) {
		const html = await readFile(`dist/client${path === "/" ? "" : path.replace(/\/$/, "")}/index.html`, "utf8");
		expect(load(html)("main h1").length).toBeGreaterThan(0);
		expect(html).not.toContain("/_serverFn/");
	}
	const entries = await readdir("dist/client");
	expect(entries).not.toContain("_worker.js");
	expect(entries).not.toContain("functions");
	expect(entries).toContain("404.html");
});

test("all internal navigation links target exported pages in the same language", async () => {
	const exportedPaths = new Set(STATIC_PAGE_PATHS);
	for (const path of STATIC_PAGE_PATHS) {
		const response = await fetch(`${server.baseUrl}${path}`);
		const $ = load(await response.text());
		const lang = $("html").attr("lang");
		for (const element of $("a[href]").toArray()) {
			const href = $(element).attr("href");
			if (!href?.startsWith("/") || href.startsWith("//")) continue;
			const target = new URL(href, server.baseUrl).pathname;
			expect(exportedPaths.has(target), `${path} links to a redirecting or unexported page: ${href}`).toBe(true);
			const isLanguageSwitch = $(element).attr("hreflang");
			if (!isLanguageSwitch)
				expect(target.startsWith("/en"), `${path} loses its language: ${href}`).toBe(lang === "en");
		}
	}
});

test("all source routes enforce first-party visibility and missing routes return 404", async () => {
	for (const [slug, source] of Object.entries(sources)) {
		const response = await fetch(`${server.baseUrl}/forras/${slug}`);
		expect(response.status, slug).toBe(source.originalUrl || source.internalUrl ? 404 : 200);
	}
	for (const lang of ["hu", "en"] as const) {
		for (const path of ["/nincs-ilyen-oldal", "/forras/nincs-ilyen-forras"]) {
			const response = await fetch(`${server.baseUrl}${localizePath(path, lang)}`);
			expect(response.status).toBe(404);
			const $ = load(await response.text());
			expect($("main h1").text()).toBe("404");
			expect($("title").text()).toBe("404 | Stop Kriptovalidáció");
			expect($("meta[name=robots]").attr("content")).toBe("noindex, nofollow");
			expect($("link[rel=stylesheet]")).toHaveLength(1);
			expect($("script[src], script[type=module], script[data-tsr-stream-part], link[rel=modulepreload]")).toHaveLength(
				0,
			);
			expect($("script")).toHaveLength(1);
		}
	}
}, 20000);

test("static sitemap has both language URLs, alternates and cache headers", async () => {
	const response = await fetch(`${server.baseUrl}/sitemap.xml`);
	expect(response.status).toBe(200);
	expect(response.headers.get("content-type")).toContain("application/xml");
	expect(response.headers.get("cache-control")).toBe("public, max-age=86400");
	const $ = load(await response.text(), { xml: true });
	expect($("url")).toHaveLength(8);
	expect($("xhtml\\:link")).toHaveLength(24);
	const locations = new Set(
		$("loc")
			.map((_, element) => $(element).text())
			.toArray(),
	);
	for (const path of PUBLIC_PAGE_PATHS) {
		for (const lang of ["hu", "en"] as const) {
			expect(locations.has(`${SITE_URL}${localizePath(path, lang)}`)).toBe(true);
		}
	}
	for (const url of locations) {
		const path = new URL(url).pathname;
		const page = await fetch(`${server.baseUrl}${path}`, { redirect: "manual" });
		expect(page.status, url).toBe(200);
		expect(load(await page.text())("link[rel=canonical]").attr("href")).toBe(url);
	}
	for (const element of $("xhtml\\:link").toArray()) {
		expect(locations.has($(element).attr("href") ?? "")).toBe(true);
	}
});

test("every published static asset is served byte-for-byte", async () => {
	async function checkDirectory(directory: string): Promise<void> {
		const entries = await readdir(`static/${directory}`, { withFileTypes: true });
		await Promise.all(
			entries.map(async (entry) => {
				const relative = `${directory}${entry.name}`;
				if (entry.isDirectory()) return checkDirectory(`${relative}/`);
				if (entry.name === "_headers") return; // Pages interprets this configuration; it is not a public asset.
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
