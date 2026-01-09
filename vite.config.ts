import { defineConfig, type Plugin } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

function reloadOnI18nChange(): Plugin {
	return {
		name: "reload-on-i18n-change",
		handleHotUpdate({ file, server }): void {
			if (file.includes("/i18n/locales/")) {
				server.hot.send({ type: "full-reload" });
			}
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
	plugins: [fresh({ serverEntry: "main.tsx" }), tailwindcss(), reloadOnI18nChange()],
});
