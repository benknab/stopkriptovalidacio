import { createHash } from "node:crypto";
import { load } from "cheerio";

function hash(value: unknown): string {
	return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

// Fingerprints capture the original site's content, destinations, images, styling and SEO,
// ignoring framework transport, attribute ordering, resource preloads and whitespace.
export function pageFingerprint(html: string) {
	const $ = load(html);
	const main = $("main");
	return {
		text: hash(main.text().replace(/\s+/g, " ").trim()),
		links: hash(
			main
				.find("a")
				.map((_, element) => [$(element).attr("href"), $(element).text().trim()])
				.toArray(),
		),
		images: hash(
			main
				.find("img")
				.map((_, element) => [
					$(element)
						.attr("src")
						?.replace(/\?__frsh_c=[^&]+/, ""),
					$(element).attr("alt"),
					$(element).attr("width"),
					$(element).attr("height"),
				])
				.toArray(),
		),
		classes: hash(
			main
				.find("[class]")
				.map((_, element) => $(element).attr("class"))
				.toArray(),
		),
		seo: hash({
			title: $("head title").text(),
			meta: $("head meta[name=description], head meta[name=robots], head meta[property], head meta[name^=twitter]")
				.map((_, element) => [$(element).attr("name") ?? $(element).attr("property"), $(element).attr("content")])
				.toArray()
				.sort(),
			links: $("head link[rel=canonical], head link[rel=alternate]")
				.map((_, element) => [$(element).attr("rel"), $(element).attr("href"), $(element).attr("hreflang")])
				.toArray()
				.sort(),
		}),
	};
}
