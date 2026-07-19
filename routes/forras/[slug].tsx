import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import type { JSX } from "preact";
import { Layout } from "../../components/layout.tsx";
import { Link } from "../../components/link.tsx";
import { MetaTags } from "../../components/seo/meta-tags.tsx";
import { sources } from "../../data/sources.ts";
import { detectLanguage, t } from "../../i18n/index.ts";

export default define.page(function SourceDetail(ctx): JSX.Element | Response {
	const slug = ctx.params.slug;
	const source = sources[slug];

	// Only serve sources whose first-party content lives on this route.
	if (!source || source.originalUrl || source.internalUrl) {
		return new Response(null, { status: 404 });
	}

	const url = new URL(ctx.req.url);
	const lang = detectLanguage(ctx.req);
	const currentPath = url.pathname + url.search;
	const title = source.title[lang];

	return (
		<Layout lang={lang} currentPath={currentPath}>
			<Head>
				<MetaTags
					lang={lang}
					titleKey="source.page_title"
					titleParams={{ title }}
					descriptionKey="source.page_description"
					canonicalPath={`/forras/${slug}`}
					noIndex
				/>
			</Head>

			{/* Back link */}
			<div class="mb-6">
				<Link href="/#idovonal" class="inline-flex items-center gap-1 text-sm">
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					{t("source.back_to_timeline", lang)}
				</Link>
			</div>

			{/* Label */}
			<span class="inline-block text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
				{t("source.first_party_label", lang)}
			</span>

			{/* Title */}
			<h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-6">
				{title}
			</h1>

			{/* Summary */}
			{source.summary && (
				<p class="text-lg text-slate-600 leading-relaxed mb-8">
					{source.summary[lang]}
				</p>
			)}

			{/* Full text */}
			{source.text && (
				<section class="border-t border-slate-200 pt-6">
					<h2 class="text-lg font-semibold text-slate-900 mb-4">
						{t("source.full_text", lang)}
					</h2>
					<blockquote class="bg-slate-50 border-l-4 border-slate-300 rounded-r-lg p-6 text-slate-700 leading-relaxed whitespace-pre-line">
						{source.text[lang]}
					</blockquote>
				</section>
			)}
		</Layout>
	);
});
