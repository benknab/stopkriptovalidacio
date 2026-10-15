import { buildCanonicalUrl, buildHreflangUrls } from "./seo.ts";

const SITEMAP_PAGES = [
	{ path: "/", priority: "1.0", changefreq: "weekly" },
	{ path: "/kriptovalidalas", priority: "0.9", changefreq: "weekly" },
	{ path: "/szavazas", priority: "0.8", changefreq: "weekly" },
	{ path: "/rolunk", priority: "0.8", changefreq: "monthly" },
];
const LANGUAGES = ["hu", "en"] as const;

export function buildSitemap(): string {
	const urls = SITEMAP_PAGES.flatMap(({ path, priority, changefreq }) =>
		LANGUAGES.map((lang) => {
			const alternates = buildHreflangUrls(path)
				.map(({ lang, url }) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`)
				.join("\n");
			return `  <url>
    <loc>${buildCanonicalUrl(path, lang)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`;
		}),
	);
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>\n`;
}
