import { defineConfig } from "vite-plus";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { fileURLToPath } from "node:url";

export default defineConfig(({ mode }) => ({
	publicDir: "static",
	resolve: { tsconfigPaths: true },
	plugins:
		mode === "test"
			? [react()]
			: [
					tailwindcss(),
					tanstackStart({
						srcDirectory: ".",
						router: { generatedRouteTree: "route-tree.gen.ts" },
					}),
					nitro({
						preset: "node-server",
						publicAssets: [{ dir: fileURLToPath(new URL("./static", import.meta.url)), baseURL: "/" }],
					}),
					react(),
				],
	build: { target: "baseline-widely-available" },
	test: { include: ["tests/**/*.test.{ts,tsx}"] },
	lint: { ignorePatterns: ["route-tree.gen.ts", "dist/**", ".output/**"] },
	fmt: {
		useTabs: true,
		printWidth: 120,
		ignorePatterns: ["route-tree.gen.ts", "dist/**", ".output/**", "archive/**", "emails/**", ".agents/**"],
	},
	staged: { "*": "vp check --fix" },
}));
