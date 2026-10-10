import { createFileRoute } from "@tanstack/react-router";
import { usePagePath } from "../../hooks/use-page-path.ts";
import type { JSX } from "react";
import { Layout } from "../../components/layout.tsx";
import { getPageHead } from "../../utils/page-head.ts";
import { t } from "../../i18n/index.ts";
import MpsSection, { ALL_OPTION } from "../../components/mps-section.tsx";

const HISTORICAL_VOTE_YEAR = 2022;

export const Route = createFileRoute("/{-$lang}/szavazas")({
	head: ({ matches }) => getPageHead(matches[0].context.lang, "vote-history", "/szavazas"),
	component: VoteHistory,
});

function VoteHistory(): JSX.Element {
	const { lang } = Route.useRouteContext();
	const currentPath = usePagePath();
	const url = new URL(currentPath, "http://localhost");
	const mpCounty = url.searchParams.get("megye") ?? ALL_OPTION;
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
			<h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">{t("vote_history.title", lang)}</h1>

			<p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-3xl">{t("vote_history.description", lang)}</p>
		</Layout>
	);
}
