import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import type { JSX } from "preact";
import { Layout } from "../components/layout.tsx";
import { SeoHead } from "../components/seo/seo-head.tsx";
import { detectLanguage, t } from "../i18n/index.ts";
import MpsSection, { ALL_OPTION } from "../islands/mps-section.tsx";

const HISTORICAL_VOTE_YEAR = 2022;

export default define.page(function VoteHistory(ctx): JSX.Element {
	const url = new URL(ctx.req.url);
	const lang = detectLanguage(ctx.req);
	const currentPath = url.pathname + url.search;
	const mpCounty = url.searchParams.get("megye") || ALL_OPTION;
	const mpDistrict = url.searchParams.get("kerulet") || "";

	return (
		<Layout
			lang={lang}
			currentPath={currentPath}
			afterContent={
				<MpsSection
					lang={lang}
					selectedCounty={mpCounty}
					selectedDistrict={mpDistrict}
					electionYear={HISTORICAL_VOTE_YEAR}
					sectionId="szavazas"
					showHeading={false}
				/>
			}
		>
			<Head>
				<SeoHead lang={lang} pageId="vote-history" path="/szavazas" />
			</Head>
			<h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-4">
				{t("vote_history.title", lang)}
			</h1>

			<p class="text-lg text-slate-600 leading-relaxed mb-4 max-w-3xl">
				{t("vote_history.description", lang)}
			</p>
		</Layout>
	);
});
