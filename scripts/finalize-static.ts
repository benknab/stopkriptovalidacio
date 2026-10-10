import { copyFile, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { STATIC_PAGE_PATHS } from "../utils/static-pages.ts";
import { buildSitemap } from "../utils/sitemap.ts";

const OUTPUT_DIRECTORY = "dist/client";

// Fail instead of accidentally publishing an SPA shell or an incomplete static export.
for (const path of STATIC_PAGE_PATHS) {
	const html = await readFile(join(OUTPUT_DIRECTORY, path, "index.html"), "utf8");
	if (!html.includes("<main") || !html.includes("<h1")) throw new Error(`Missing prerendered content: ${path}`);
	if (html.includes("/_serverFn/")) throw new Error(`Static page still depends on server functions: ${path}`);
}

await copyFile(join(OUTPUT_DIRECTORY, "404/index.html"), join(OUTPUT_DIRECTORY, "404.html"));

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
