import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	environments: {
		client: {
			build: {
				target: "baseline-widely-available",
			},
		},
		ssr: {
			build: {
				target: "esnext",
			},
		},
	},
	plugins: [fresh({ serverEntry: "main.tsx" }), tailwindcss()],
});
