import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./route-tree.gen.ts";
import { parseSearch, stringifySearch } from "./utils/search.ts";

export function getRouter() {
	return createRouter({
		routeTree,
		// Pages serves directory URLs. Normalizing /en/ to /en during hydration
		// replaces the history entry and loses its saved scroll-restoration key.
		trailingSlash: "preserve",
		scrollRestoration: true,
		parseSearch,
		stringifySearch,
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
