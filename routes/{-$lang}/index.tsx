import { createFileRoute } from "@tanstack/react-router";
import { usePagePath } from "../../hooks/use-page-path.ts";
import type { JSX } from "react";
import { ExchangesSection } from "../../components/exchanges-section.tsx";
import { H2 } from "../../components/h2.tsx";
import { Hero } from "../../components/hero.tsx";
import { Layout } from "../../components/layout.tsx";
import { getPageHead } from "../../utils/page-head.ts";
import { t } from "../../i18n/index.ts";
import TimelineSection from "../../islands/timeline-section.tsx";

export const Route = createFileRoute("/{-$lang}/")({
	head: ({ matches }) => getPageHead(matches[0].context.lang, "home", "/"),
	component: Home,
});

function Home(): JSX.Element {
	const { lang } = Route.useRouteContext();
	const currentPath = usePagePath();
	const url = new URL(currentPath, "http://localhost");
	const showSecondary = url.searchParams.get("masodlagos") !== "false";
	const showTertiary = url.searchParams.get("harmadlagos") === "true";

	return (
		<Layout
			lang={lang}
			currentPath={currentPath}
			hero={
				<>
					<Hero lang={lang} />
					<ExchangesSection lang={lang} />
				</>
			}
		>
			<section id="idovonal">
				<H2 className="mb-6">{t("nav.timeline", lang)}</H2>
				<TimelineSection lang={lang} showSecondary={showSecondary} showTertiary={showTertiary} />
			</section>
		</Layout>
	);
}
