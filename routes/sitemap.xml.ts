import { define } from "@/utils.ts";
import { SITE_URL } from "../constants/seo.ts";
import { mps } from "../data/mps.ts";

function buildUrlEntry(
	loc: string,
	priority: string,
	changefreq: "daily" | "weekly" | "monthly",
): string {
	return `	<url>
		<loc>${SITE_URL}${loc}</loc>
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>
		<xhtml:link rel="alternate" hreflang="hu" href="${SITE_URL}${loc}" />
		<xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${loc}" />
		<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${loc}" />
	</url>`;
}

export const handler = define.handlers({
	GET(): Response {
		const mpSlugs = Object.keys(mps);

		const urls = [
			buildUrlEntry("/", "1.0", "weekly"),
			buildUrlEntry("/kriptovalidalas", "0.9", "weekly"),
			buildUrlEntry("/rolunk", "0.8", "monthly"),
			...mpSlugs.map((slug) => buildUrlEntry(`/parlament/${slug}`, "0.6", "monthly")),
		];

		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

		return new Response(sitemap, {
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=86400",
			},
		});
	},
});
