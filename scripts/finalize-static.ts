import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";
import { STATIC_PAGE_PATHS } from "../utils/static-pages.ts";
import { buildSitemap } from "../utils/sitemap.ts";
import { localizePath } from "../utils/localized-path.ts";

const OUTPUT_DIRECTORY = "dist/client";

// Fail instead of accidentally publishing an SPA shell or an incomplete static export.
for (const path of STATIC_PAGE_PATHS) {
	const html = await readFile(join(OUTPUT_DIRECTORY, path, "index.html"), "utf8");
	if (!html.includes("<main") || !html.includes("<h1")) throw new Error(`Missing prerendered content: ${path}`);
	if (html.includes("/_serverFn/")) throw new Error(`Static page still depends on server functions: ${path}`);
}

// Pages serves this document at arbitrary missing URLs. It cannot hydrate a
// router payload prerendered for /404, so retain the HTML/CSS but not the app runtime.
const notFound = load(await readFile(join(OUTPUT_DIRECTORY, "404/index.html"), "utf8"));
notFound("script, link[rel=modulepreload], link[rel=preload][as=script]").remove();
notFound("body").append(`<script>
document.documentElement.lang = /^\\/en(?:\\/|$)/.test(window.location.pathname) ? "en" : "hu";
document.querySelector("main a").setAttribute("href", document.documentElement.lang === "en"
  ? ${JSON.stringify(localizePath("/", "en"))} : ${JSON.stringify(localizePath("/", "hu"))});
</script>`);
await writeFile(join(OUTPUT_DIRECTORY, "404.html"), notFound.html());
await writeFile(join(OUTPUT_DIRECTORY, "404/index.html"), notFound.html());

await writeFile(join(OUTPUT_DIRECTORY, "sitemap.xml"), buildSitemap());

async function checkNoWorker(directory: string): Promise<void> {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		if (entry.name === "_worker.js" || entry.name === "functions")
			throw new Error("Pages output must not contain a Worker or Functions.");
		if (entry.isDirectory()) await checkNoWorker(join(directory, entry.name));
	}
}
await checkNoWorker(OUTPUT_DIRECTORY);
// The Vite plugin creates a Workers deployment pointer for its build-time SSR bundle.
// Pages must read the root static Pages config instead, not deploy that server bundle.
await rm(".wrangler/deploy/config.json", { force: true });
console.log(
	`Static Pages export ready: ${STATIC_PAGE_PATHS.length} bilingual pages, sitemap and 404 page in ${OUTPUT_DIRECTORY}.`,
);
