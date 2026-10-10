import { createFileRoute, notFound } from "@tanstack/react-router";
import { usePagePath } from "../../../hooks/use-page-path.ts";
import type { JSX } from "react";
import { Layout } from "../../../components/layout.tsx";
import { Link } from "../../../components/link.tsx";
import { getSourceHead } from "../../../utils/page-head.ts";
import { sources } from "../../../data/sources.ts";
import { t } from "../../../i18n/index.ts";

export const Route = createFileRoute("/{-$lang}/forras/$slug")({
	beforeLoad: ({ params }) => {
		const source = sources[params.slug];
		if (!source || source.originalUrl || source.internalUrl) throw notFound();
	},
	head: ({ params, matches }) => getSourceHead(matches[0].context.lang, params.slug),
	component: SourceDetail,
});

function SourceDetail(): JSX.Element {
	const { slug } = Route.useParams();
	const source = sources[slug];
	const { lang } = Route.useRouteContext();
	const currentPath = usePagePath();
	const title = source.title[lang];

	return (
		<Layout lang={lang} currentPath={currentPath}>
			{/* Back link */}
			<div className="mb-6">
				<Link href="/#idovonal" lang={lang} className="inline-flex items-center gap-1 text-sm">
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
					{t("source.back_to_timeline", lang)}
				</Link>
			</div>

			{/* Label */}
			<span className="inline-block text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
				{t("source.first_party_label", lang)}
			</span>

			{/* Title */}
			<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-6">{title}</h1>

			{/* Summary */}
			{source.summary && <p className="text-lg text-slate-600 leading-relaxed mb-8">{source.summary[lang]}</p>}

			{/* Full text */}
			{source.text && (
				<section className="border-t border-slate-200 pt-6">
					<h2 className="text-lg font-semibold text-slate-900 mb-4">{t("source.full_text", lang)}</h2>
					<blockquote className="bg-slate-50 border-l-4 border-slate-300 rounded-r-lg p-6 text-slate-700 leading-relaxed whitespace-pre-line">
						{source.text[lang]}
					</blockquote>
				</section>
			)}
		</Layout>
	);
}
