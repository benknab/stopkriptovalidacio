import { describe, expect, test } from "vite-plus/test";
import { parseSearch, stringifySearch } from "../utils/search.ts";
import { buildMailtoUrl } from "../utils/mailto.ts";
import { detectLanguage, t } from "../i18n/index.ts";
import hu from "../i18n/locales/hu.json" with { type: "json" };
import en from "../i18n/locales/en.json" with { type: "json" };

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
