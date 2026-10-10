import { createFileRoute, useLocation } from "@tanstack/react-router";
import type { JSX } from "react";
import { H2 } from "../components/h2.tsx";
import { Layout } from "../components/layout.tsx";
import { Link } from "../components/link.tsx";
import { getPageHead } from "../utils/page-head.ts";
import { t } from "../i18n/index.ts";

export const Route = createFileRoute("/kriptovalidalas")({
	head: ({ matches }) => getPageHead(matches[0].context.lang, "crypto-validation", "/kriptovalidalas"),
	component: CryptoValidation,
});

function CryptoValidation(): JSX.Element {
	const { lang } = Route.useRouteContext();
	const currentPath = useLocation({ select: (location) => location.pathname + location.searchStr });

	return (
		<Layout lang={lang} currentPath={currentPath}>
			<h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">{t("crypto_validation.title", lang)}</h1>

			<p className="text-lg text-slate-600 leading-relaxed mb-8">{t("crypto_validation.intro", lang)}</p>

			{/* Key facts: Unique + Criminal */}
			<div className="grid md:grid-cols-2 gap-6 mb-12">
				<section className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6">
					<h3 className="text-xl font-bold text-amber-900 mb-3">{t("crypto_validation.unique_title", lang)}</h3>
					<p className="text-amber-800 leading-relaxed">{t("crypto_validation.unique_text", lang)}</p>
				</section>

				<section className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6">
					<h3 className="text-xl font-bold text-red-900 mb-3">{t("crypto_validation.criminal_title", lang)}</h3>
					<p className="text-red-800 leading-relaxed">{t("crypto_validation.criminal_text", lang)}</p>
				</section>
			</div>

			{/* What the law requires / What is not defined */}
			<div className="grid md:grid-cols-2 gap-6 mb-12">
				<section className="bg-slate-100 rounded-xl p-6">
					<h3 className="text-lg font-bold text-slate-900 mb-3">{t("crypto_validation.what_we_know", lang)}</h3>
					<p className="text-slate-600 leading-relaxed">{t("crypto_validation.what_we_know_text", lang)}</p>
				</section>

				<section className="bg-slate-100 rounded-xl p-6">
					<h3 className="text-lg font-bold text-slate-900 mb-3">{t("crypto_validation.what_we_dont_know", lang)}</h3>
					<p className="text-slate-600 leading-relaxed">{t("crypto_validation.what_we_dont_know_text", lang)}</p>
				</section>
			</div>

			{/* Validator Section */}
			<section id="kriptovalidator" className="mb-12">
				<H2 className="mb-4 text-left text-2xl sm:text-2xl">{t("crypto_validation.validator_title", lang)}</H2>
				<p className="text-slate-600 leading-relaxed mb-6">{t("crypto_validation.validator_intro", lang)}</p>

				<div className="bg-slate-100 rounded-xl p-6 mb-6">
					<h3 className="text-lg font-bold text-slate-900 mb-3">
						{t("crypto_validation.validator_requirements", lang)}
					</h3>
					<p className="text-slate-600 leading-relaxed">{t("crypto_validation.validator_requirements_text", lang)}</p>
				</div>

				<div className="bg-amber-50 border-l-4 border-amber-400 p-6">
					<h3 className="text-lg font-bold text-amber-900 mb-3">{t("crypto_validation.validator_problem", lang)}</h3>
					<p className="text-amber-800 leading-relaxed">{t("crypto_validation.validator_problem_text", lang)}</p>
				</div>
			</section>

			{/* Sources */}
			<section className="mb-12">
				<H2 className="mb-4 text-left text-2xl sm:text-2xl">{t("crypto_validation.sources_title", lang)}</H2>
				<p className="text-slate-600 leading-relaxed mb-4">{t("crypto_validation.sources_text", lang)}</p>
				<Link href="/#idovonal" className="text-brand hover:underline font-medium">
					{t("crypto_validation.timeline_link", lang)} →
				</Link>
				<div className="mt-3">
					<Link href="/szavazas" className="font-medium">
						{t("vote_history.law_link", lang)} →
					</Link>
				</div>
			</section>
		</Layout>
	);
}
