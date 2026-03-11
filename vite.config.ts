import { defineConfig, type Plugin } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

function reloadOnDataChange(): Plugin {
	return {
		name: "reload-on-data-change",
		configureServer(server): void {
			server.watcher.on("change", (file) => {
				if (file.includes("/i18n/locales/") || file.includes("/data/")) {
					// Restart the server to reload SSR modules with new data
					server.restart();
				}
			});
		},
	};
}

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
	plugins: [fresh({ serverEntry: "main.tsx" }), tailwindcss(), reloadOnDataChange()],
});
