import type { JSX } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Analytics } from "../components/seo/analytics.tsx";
import { getPathLanguage, localizePath } from "../utils/localized-path.ts";
import "../styles.css";

export const Route = createRootRoute({
	validateSearch: (search: Record<string, unknown>) => search,
	beforeLoad: ({ location }) => ({ lang: getPathLanguage(location.pathname) }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
		],
	}),
	component: Root,
	notFoundComponent: NotFound,
});

function Root(): JSX.Element {
	const { lang } = Route.useRouteContext();
	return (
		<html lang={lang}>
			<head>
				<HeadContent />
				<Analytics />
			</head>
			<body>
				<Outlet />
				<Scripts />
			</body>
		</html>
	);
}

export function NotFound(): JSX.Element {
	const { lang } = Route.useRouteContext();
	return (
		<main>
			<h1>404</h1>
			<a href={localizePath("/", lang)}>Stop Kriptovalidáció</a>
		</main>
	);
}
