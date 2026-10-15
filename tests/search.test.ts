import { describe, expect, test } from "vite-plus/test";
import { parseSearch, stringifySearch } from "../utils/search.ts";
import { buildMailtoUrl } from "../utils/mailto.ts";
import { detectLanguage, t } from "../i18n/index.ts";
import hu from "../i18n/locales/hu.json" with { type: "json" };
import en from "../i18n/locales/en.json" with { type: "json" };
import { getHomeAnchor, getPathLanguage, localizePath, stripLanguagePrefix } from "../utils/localized-path.ts";

describe("public query format", () => {
	test("preserves zero-padded districts, Unicode, booleans, empty filters and campaign parameters", () => {
		const search = {
			megye: "Békés",
			kerulet: "01",
			masodlagos: false,
			harmadlagos: true,
			kepviselo: "",
			utm_source: "telegram",
		};
		expect(parseSearch(stringifySearch(search))).toEqual({ ...search, masodlagos: "false", harmadlagos: "true" });
		expect(stringifySearch(search)).not.toContain("%22");
		expect(stringifySearch({ megye: undefined })).toBe("");
	});
});

test("language URLs keep Hungarian paths, query parameters and anchors without double prefixes", () => {
	expect(localizePath("/szavazas?kerulet=01#szavazas", "en")).toBe("/en/szavazas/?kerulet=01#szavazas");
	expect(localizePath("/en/szavazas?kerulet=01#szavazas", "hu")).toBe("/szavazas/?kerulet=01#szavazas");
	expect(localizePath("/en/rolunk", "en")).toBe("/en/rolunk/");
	expect(localizePath("https://example.com", "en")).toBe("https://example.com");
	expect(localizePath("//example.com", "en")).toBe("//example.com");
	expect(stripLanguagePrefix("/en?masodlagos=false")).toBe("/?masodlagos=false");
	expect(getPathLanguage("/english")).toBe("hu");
	expect(getPathLanguage("/en")).toBe("en");
	expect(getHomeAnchor("idovonal", "/en/?utm_source=test")).toBe("#idovonal");
	expect(getHomeAnchor("idovonal", "/en/rolunk")).toBe("/en/#idovonal");
});

test.each([
	["/", "hu", "/"],
	["/", "en", "/en/"],
	["/en", "hu", "/"],
	["/en?masodlagos=false#idovonal", "en", "/en/?masodlagos=false#idovonal"],
	["/rolunk", "hu", "/rolunk/"],
	["/rolunk/", "en", "/en/rolunk/"],
	["/en/rolunk/", "hu", "/rolunk/"],
	["/en/rolunk/", "en", "/en/rolunk/"],
	["/rolunk#adatvedelem", "hu", "/rolunk/#adatvedelem"],
	["/forras/etoro-email-visszateres", "en", "/en/forras/etoro-email-visszateres/"],
] as const)("page URL %s (%s) uses the exported directory path", (path, lang, expected) => {
	expect(localizePath(path, lang)).toBe(expected);
	expect(localizePath(expected, lang)).toBe(expected);
});

test.each([
	"/bitcoin.pdf",
	"/kepek/logo.png?size=48#preview",
	"/sitemap.xml",
	"https://example.com/page?lang=hu#section",
	"//example.com/page",
	"mailto:info@stopkriptovalidacio.hu",
	"#idovonal",
])("asset, external or fragment URL %s is not localized or given a trailing slash", (path) => {
	for (const lang of ["hu", "en"] as const) expect(localizePath(path, lang)).toBe(path);
});

test("both languages contain the same translation keys", () => {
	function keys(value: unknown, prefix = ""): string[] {
		if (typeof value === "string") return [prefix];
		return Object.entries(value as Record<string, unknown>)
			.flatMap(([key, value]) => keys(value, `${prefix}.${key}`))
			.sort();
	}
	expect(keys(en)).toEqual(keys(hu));
	expect(t("source.page_title", "hu", { title: "Példa" })).toContain("Példa");
	expect(detectLanguage(new Request("https://example.com"))).toBe("hu");
});

test("email URLs encode Hungarian subjects and message line breaks", () => {
	const url = buildMailtoUrl({
		to: ["mp@example.com"],
		subject: "Állásfoglalás",
		body: "Tisztelt Képviselő!\nKöszönöm.",
	});
	if (!url) throw new Error("Missing email URL");
	expect(decodeURIComponent(url)).toContain("mailto:mp@example.com");
	expect(decodeURIComponent(url)).toContain("Állásfoglalás");
	expect(decodeURIComponent(url)).toContain("Tisztelt Képviselő!\r\nKöszönöm.");
});
