import { useHydrated, useLocation } from "@tanstack/react-router";

// Static documents are built without query parameters. The first browser render
// must match that HTML before applying the visitor's URL-backed filters.
export function usePagePath(): string {
	const hydrated = useHydrated();
	const pathname = useLocation({ select: (location) => location.pathname });
	const searchStr = useLocation({ select: (location) => location.searchStr });
	return pathname + (hydrated ? searchStr : "");
}
