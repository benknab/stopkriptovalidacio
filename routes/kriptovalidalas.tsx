import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import type { JSX } from "preact";
import { ButtonLink } from "../components/button-link.tsx";
import { H2 } from "../components/h2.tsx";
import { Layout } from "../components/layout.tsx";
import { Link } from "../components/link.tsx";
import { SeoHead } from "../components/seo/seo-head.tsx";
import { detectLanguage, t } from "../i18n/index.ts";

export default define.page(function CryptoValidation(ctx): JSX.Element {
	const url = new URL(ctx.req.url);
	const lang = detectLanguage(ctx.req);
	const currentPath = url.pathname + url.search;

	return (
		<Layout lang={lang} currentPath={currentPath}>
			<Head>
				<SeoHead lang={lang} pageId="crypto-validation" path="/kriptovalidalas" />
			</Head>
			<h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-8">
				{t("crypto_validation.title", lang)}
			</h1>

			<p class="text-lg text-slate-600 leading-relaxed mb-8">
				{t("crypto_validation.intro", lang)}
			</p>

			{/* Key facts: Unique + Criminal */}
			<div class="grid md:grid-cols-2 gap-6 mb-12">
				<section class="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6">
					<h3 class="text-xl font-bold text-amber-900 mb-3">
						{t("crypto_validation.unique_title", lang)}
					</h3>
					<p class="text-amber-800 leading-relaxed">
						{t("crypto_validation.unique_text", lang)}
					</p>
				</section>

				<section class="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6">
					<h3 class="text-xl font-bold text-red-900 mb-3">
						{t("crypto_validation.criminal_title", lang)}
					</h3>
					<p class="text-red-800 leading-relaxed">
						{t("crypto_validation.criminal_text", lang)}
					</p>
				</section>
			</div>

			{/* What the law requires / What is not defined */}
			<div class="grid md:grid-cols-2 gap-6 mb-12">
				<section class="bg-slate-100 rounded-xl p-6">
					<h3 class="text-lg font-bold text-slate-900 mb-3">
						{t("crypto_validation.what_we_know", lang)}
					</h3>
					<p class="text-slate-600 leading-relaxed">
						{t("crypto_validation.what_we_know_text", lang)}
					</p>
				</section>

				<section class="bg-slate-100 rounded-xl p-6">
					<h3 class="text-lg font-bold text-slate-900 mb-3">
						{t("crypto_validation.what_we_dont_know", lang)}
					</h3>
					<p class="text-slate-600 leading-relaxed">
						{t("crypto_validation.what_we_dont_know_text", lang)}
					</p>
				</section>
			</div>

			{/* Validator Section */}
			<section id="kriptovalidator" class="mb-12">
				<H2 class="mb-4 text-left text-2xl sm:text-2xl">
					{t("crypto_validation.validator_title", lang)}
				</H2>
				<p class="text-slate-600 leading-relaxed mb-6">
					{t("crypto_validation.validator_intro", lang)}
				</p>

				<div class="bg-slate-100 rounded-xl p-6 mb-6">
					<h3 class="text-lg font-bold text-slate-900 mb-3">
						{t("crypto_validation.validator_requirements", lang)}
					</h3>
					<p class="text-slate-600 leading-relaxed">
						{t("crypto_validation.validator_requirements_text", lang)}
					</p>
				</div>

				<div class="bg-amber-50 border-l-4 border-amber-400 p-6">
					<h3 class="text-lg font-bold text-amber-900 mb-3">
						{t("crypto_validation.validator_problem", lang)}
					</h3>
					<p class="text-amber-800 leading-relaxed">
						{t("crypto_validation.validator_problem_text", lang)}
					</p>
				</div>
			</section>

			{/* Sources */}
			<section class="mb-12">
				<H2 class="mb-4 text-left text-2xl sm:text-2xl">
					{t("crypto_validation.sources_title", lang)}
				</H2>
				<p class="text-slate-600 leading-relaxed mb-4">
					{t("crypto_validation.sources_text", lang)}
				</p>
				<Link href="/#idovonal" class="text-brand hover:underline font-medium">
					{t("crypto_validation.timeline_link", lang)} →
				</Link>
			</section>

			{/* CTA */}
			<section class="bg-brand rounded-xl p-8 text-center text-white">
				<h2 class="text-2xl font-bold mb-4">
					{t("crypto_validation.cta_title", lang)}
				</h2>
				<p class="text-white/90 mb-6">
					{t("crypto_validation.cta_text", lang)}
				</p>
				<ButtonLink href="/#cselekedj">
					{t("crypto_validation.cta_button", lang)}
				</ButtonLink>
			</section>
		</Layout>
	);
});
