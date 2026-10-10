import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { t } from "../i18n/index.ts";
import { startProductionServer } from "./production-server.ts";
import { localizePath } from "../utils/localized-path.ts";
import { pageFingerprint } from "./page-fingerprint.ts";
import { createHash } from "node:crypto";
import baseline from "./fixtures/migration-baseline.json" with { type: "json" };

const executeFile = promisify(execFile);
const SESSION = `crypto-regression-${process.pid}`;
const ARTIFACT_DIRECTORY = resolve("tmp/browser-regression");
const server = await startProductionServer();
let checks = 0;
let activeLanguage: "hu" | "en" = "hu";

async function browser(...args: string[]) {
	const { stdout } = await executeFile("agent-browser", ["--session", SESSION, "--json", ...args], {
		timeout: 30000,
		maxBuffer: 4 * 1024 * 1024,
	});
	const response = JSON.parse(stdout) as { success: boolean; data: Record<string, unknown>; error: unknown };
	if (!response.success) throw new Error(`Browser command failed (${args[0]}): ${JSON.stringify(response.error)}`);
	return response.data;
}

async function evaluate<T>(code: string): Promise<T> {
	return (await browser("eval", code)).result as T;
}

async function check(condition: string, message: string): Promise<void> {
	assert.equal(await evaluate(condition), true, message);
	checks++;
}

async function open(path: string): Promise<void> {
	await browser("open", `${server.baseUrl}${localizePath(path, activeLanguage)}`);
	await browser("wait", "--load", "networkidle");
}

async function checkBaseline(name: string): Promise<void> {
	const html = await evaluate<string>("document.documentElement.outerHTML");
	const fingerprint = createHash("sha256")
		.update(JSON.stringify(pageFingerprint(html)))
		.digest("hex");
	assert.equal(
		fingerprint,
		baseline[`${name}-${activeLanguage}` as keyof typeof baseline],
		`${name} (${activeLanguage}) changed from the original content/design baseline`,
	);
	checks++;
}

async function checkErrors(): Promise<void> {
	const errors = (await browser("errors")).errors;
	assert.deepEqual(errors, [], "The production browser reported runtime errors");
	const messages = (await browser("console")).messages as Array<{ type: string; text: string }>;
	assert.deepEqual(
		messages.filter((message) => message.type === "error" && !message.text.includes("tomato.hospitablealpaca.com")),
		[],
		"The browser reported console/hydration errors",
	);
	checks++;
	await check(
		"!performance.getEntriesByType('resource').some(entry => entry.name.includes('/_serverFn/'))",
		"Static navigation attempted to call a backend server function",
	);
}

try {
	await mkdir(ARTIFACT_DIRECTORY, { recursive: true });
	await browser("open", server.baseUrl);
	// Analytics is unrelated to application behavior; keep QA requests off the live tracker.
	await browser("network", "route", "https://tomato.hospitablealpaca.com/**", "--body", "");
	await browser("set", "viewport", "1280", "577");

	for (const lang of ["hu", "en"] as const) {
		activeLanguage = lang;
		await open("/");
		await check(
			`document.documentElement.lang === ${JSON.stringify(lang)}`,
			"The static URL rendered the wrong document language",
		);
		await check("document.querySelectorAll('head title').length === 1", "Duplicate page title");
		await browser("screenshot", resolve(ARTIFACT_DIRECTORY, `home-${lang}-desktop.png`));
		await checkBaseline("home");

		for (const path of ["/", "/rolunk", "/kriptovalidalas", "/forras/etoro-email-visszateres", "/szavazas"]) {
			await open(path);
			await check(
				`document.documentElement.lang === ${JSON.stringify(lang)} && !!document.querySelector('main h1')`,
				`${path}: missing page or wrong language`,
			);
			await check("document.documentElement.scrollWidth <= innerWidth", `${path}: horizontal overflow on desktop`);
			await check(
				"!!document.querySelector('head link[rel=canonical]') && !!document.querySelector('head meta[name=description]')",
				`${path}: SEO missing after hydration`,
			);
			await checkErrors();
		}

		await open("/?masodlagos=false");
		await browser("wait", "--fn", "!document.querySelector('#idovonal label:nth-child(2) input').checked");
		await checkBaseline("primary");
		await open("/?harmadlagos=true");
		await browser("wait", "--fn", "document.querySelector('#idovonal label:nth-child(3) input').checked");
		await checkBaseline("all");
		await open("/szavazas?megye=Budapest&kerulet=01");
		await browser("wait", "--fn", "document.querySelectorAll('#szavazas img').length === 0");
		await checkBaseline("county");

		await open("/?utm_source=regression#idovonal");
		const originalCount = await evaluate<number>("document.querySelectorAll('#idovonal h3').length");
		await browser("uncheck", "#idovonal label:nth-child(2) input");
		await browser("wait", "--fn", "new URL(location.href).searchParams.get('masodlagos') === 'false'");
		await check(
			`document.querySelectorAll('#idovonal h3').length < ${originalCount}`,
			"Timeline related-event filter did not update content",
		);
		await browser("check", "#idovonal label:nth-child(3) input");
		await browser("wait", "--fn", "new URL(location.href).searchParams.get('harmadlagos') === 'true'");
		await check(
			"new URL(location.href).searchParams.get('utm_source') === 'regression' && location.hash === '#idovonal'",
			"Filtering lost campaign parameters or fragment",
		);
		const filteredUrl = await evaluate<string>("location.pathname + location.search + location.hash");
		await open(filteredUrl);
		await check(
			"!document.querySelector('#idovonal label:nth-child(2) input').checked && document.querySelector('#idovonal label:nth-child(3) input').checked",
			"Filter state did not survive a document reload",
		);
		await open("/rolunk");
		await browser("back");
		await browser(
			"wait",
			"--fn",
			`location.pathname.replace(/\\/$/, '') === ${JSON.stringify(localizePath("/", lang).replace(/\/$/, ""))} && !!document.querySelector('#idovonal')`,
		);
		await check("new URL(location.href).searchParams.get('harmadlagos') === 'true'", "Back navigation lost filters");
		await checkErrors();

		// Language switching is an ordinary static link, with query and fragment retained.
		await open("/szavazas?megye=Budapest&kerulet=1.+OEVK#szavazas");
		const otherLanguage = lang === "hu" ? "en" : "hu";
		await browser("find", "role", "link", "click", "--name", otherLanguage === "en" ? "English" : "Magyar");
		await browser("wait", "--fn", `document.documentElement.lang === ${JSON.stringify(otherLanguage)}`);
		await check(
			"new URL(location.href).searchParams.get('kerulet') === '1. OEVK' && location.hash === '#szavazas'",
			"Language switching lost filters or fragment",
		);
		await check(
			"document.querySelectorAll('#szavazas img').length === 1",
			"Language switching lost the selected constituency",
		);

		await open("/szavazas?utm_source=regression#szavazas");
		await check(
			"document.querySelectorAll('#szavazas img').length === 199",
			"The default voting page must show all 199 representatives",
		);
		await browser("select", "#mp-county-select", "Budapest");
		await browser("wait", "--fn", "!document.querySelector('#mp-district-select').disabled");
		await browser("select", "#mp-district-select", "1. OEVK");
		await browser("wait", "--fn", "document.querySelectorAll('#szavazas img').length === 1");
		await check(
			"document.querySelector('#szavazas').textContent.includes('Csárdi Antal')",
			"County/district combination selected the wrong historical representative",
		);
		await browser("fill", "#mp-search", "nincs ilyen képviselő");
		await browser("wait", "--text", t("mps.no_results", lang));
		// Clear with native keyboard input; some CLI versions do not dispatch an input
		// event for fill("") on a React-controlled field.
		await browser("focus", "#mp-search");
		await browser("press", "Home");
		await browser("press", "Shift+End");
		await browser("press", "Backspace");
		await browser("wait", "--fn", "document.querySelectorAll('#szavazas img').length === 1");
		await browser("select", "#mp-county-select", "__osszes__");
		await browser("wait", "--fn", "document.querySelectorAll('#szavazas img').length === 199");
		await check(
			"!new URL(location.href).searchParams.has('kerulet') && new URL(location.href).searchParams.get('utm_source') === 'regression'",
			"County changes failed to clear district or lost campaign parameters",
		);
		await browser("select", "#mp-county-select", "");
		await browser("wait", "--text", t("mps.filter.select_to_show", lang));
		await checkErrors();

		await browser("set", "viewport", "390", "844");
		await open("/");
		await check("document.documentElement.scrollWidth <= innerWidth", "Horizontal overflow on mobile");
		await browser("screenshot", resolve(ARTIFACT_DIRECTORY, `home-${lang}-mobile.png`));
		await browser("find", "role", "button", "click", "--name", t("nav.menu", lang));
		await check(
			"document.querySelector('button[aria-expanded]').getAttribute('aria-expanded') === 'true'",
			"Mobile menu did not open",
		);
		await browser("press", "Escape");
		await check(
			"document.querySelector('button[aria-expanded]').getAttribute('aria-expanded') === 'false'",
			"Escape did not close the mobile menu",
		);
		await browser("find", "role", "button", "click", "--name", t("nav.menu", lang));
		await browser("click", "nav.absolute a[href='#idovonal']");
		await check(
			"document.querySelector('button[aria-expanded]').getAttribute('aria-expanded') === 'false' && location.hash === '#idovonal'",
			"Mobile anchor navigation did not close the menu",
		);
		await checkErrors();
		await browser("set", "viewport", "1280", "577");
	}
	console.log(`Passed ${checks} production browser checks in Hungarian and English (desktop/mobile).`);
	console.log(`Screenshots: ${ARTIFACT_DIRECTORY}`);
} catch (error) {
	console.error(
		"Browser state at failure:",
		await evaluate(
			"({ url: location.href, county: document.querySelector('#mp-county-select')?.value, district: document.querySelector('#mp-district-select')?.value, search: document.querySelector('#mp-search')?.value, images: document.querySelectorAll('#szavazas img').length, text: document.querySelector('#szavazas')?.textContent?.slice(-400) })",
		),
	);
	await browser("screenshot", resolve(ARTIFACT_DIRECTORY, "failure.png"));
	throw error;
} finally {
	try {
		await browser("close");
	} finally {
		await server.stop();
	}
}
