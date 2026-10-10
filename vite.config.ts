import { defineConfig } from "vite-plus";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { STATIC_PAGE_PATHS } from "./utils/static-pages.ts";
import { buildSitemap } from "./utils/sitemap.ts";

export default defineConfig(({ mode }) => ({
	publicDir: "static",
	define: { "import.meta.env.BUILD_DATE": JSON.stringify(new Date().toISOString()) },
	resolve: { tsconfigPaths: true },
	plugins:
		mode === "test"
			? [react()]
			: [
					{
						name: "static-sitemap-dev",
						configureServer(server) {
							server.middlewares.use("/sitemap.xml", (_request, response) => {
								response.setHeader("Content-Type", "application/xml");
								response.end(buildSitemap());
							});
						},
					},
					cloudflare({ configPath: "wrangler-dev.jsonc", viteEnvironment: { name: "ssr" }, inspectorPort: false }),
					tailwindcss(),
					tanstackStart({
						srcDirectory: ".",
						router: { generatedRouteTree: "route-tree.gen.ts" },
						prerender: { enabled: true, autoStaticPathsDiscovery: false, crawlLinks: false, failOnError: true },
						pages: [...STATIC_PAGE_PATHS, "/404"].map((path) => ({ path })),
					}),
					react(),
				],
	build: { target: "baseline-widely-available" },
	test: { include: ["tests/**/*.test.{ts,tsx}"] },
	lint: { ignorePatterns: ["route-tree.gen.ts", "dist/**"] },
	fmt: {
		useTabs: true,
		printWidth: 120,
		ignorePatterns: ["route-tree.gen.ts", "dist/**", "archive/**", "emails/**", ".agents/**"],
	},
	staged: { "*": "vp check --fix" },
}));
