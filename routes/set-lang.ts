import { define } from "@/utils.ts";
import { isValidLanguage } from "../i18n/index.ts";

export const handler = define.handlers({
	GET(ctx): Response {
		const url = new URL(ctx.req.url);
		const lang = url.searchParams.get("lang");
		const redirect = url.searchParams.get("redirect") || "/";

		const headers = new Headers();
		headers.set("location", redirect);

		if (lang && isValidLanguage(lang)) {
			// Set cookie for 1 year
			headers.set(
				"set-cookie",
				`lang=${lang}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`,
			);
		}

		return new Response(null, {
			status: 302,
			headers,
		});
	},
});
