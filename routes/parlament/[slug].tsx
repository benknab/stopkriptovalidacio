import { define } from "@/utils.ts";

export const handler = define.handlers({
	GET(ctx): Response {
		const slug = ctx.params.slug;
		const url = new URL(ctx.req.url);
		const query = url.search;

		return new Response(null, {
			status: 301,
			headers: {
				location: `/ogy2022/${slug}${query}`,
			},
		});
	},
});
