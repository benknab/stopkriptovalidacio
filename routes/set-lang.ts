import { createFileRoute } from "@tanstack/react-router";
import { isValidLanguage } from "../i18n/index.ts";

export const Route = createFileRoute("/set-lang")({
	server: { handlers: { GET: setLanguage } },
});

export function setLanguage({ request }: { request: Request }): Response {
	const url = new URL(request.url);
	const lang = url.searchParams.get("lang");
	const requestedRedirect = url.searchParams.get("redirect") || "/";
	// Keep language redirects on this site, including encoded slash/backslash variants.
	let redirect = "/";
	try {
		const target = new URL(requestedRedirect, url.origin);
		if (target.origin === url.origin) redirect = target.pathname + target.search + target.hash;
	} catch {
		// Invalid redirect URLs must not turn a language switch into a server error.
	}

	const headers = new Headers();
	headers.set("location", redirect);

	if (lang && isValidLanguage(lang)) {
		// Set cookie for 1 year
		headers.set("set-cookie", `lang=${lang}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`);
	}

	return new Response(null, {
		status: 302,
		headers,
	});
}
