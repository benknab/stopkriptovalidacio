import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import type { JSX } from "preact";
import { ExchangesSection } from "../components/exchanges-section.tsx";
import { H2 } from "../components/h2.tsx";
import { Hero } from "../components/hero.tsx";
import { Layout } from "../components/layout.tsx";
import { SeoHead } from "../components/seo/seo-head.tsx";
import { detectLanguage, t } from "../i18n/index.ts";
import TimelineSection from "../islands/timeline-section.tsx";

export default define.page(function Home(ctx): JSX.Element {
	const url = new URL(ctx.req.url);
	const lang = detectLanguage(ctx.req);
	const showSecondary = url.searchParams.get("masodlagos") !== "false";
	const showTertiary = url.searchParams.get("harmadlagos") === "true";
	const currentPath = url.pathname + url.search;

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
			<Head>
				<SeoHead lang={lang} pageId="home" path="/" />
			</Head>
			<section id="idovonal">
				<H2 class="mb-6">{t("nav.timeline", lang)}</H2>
				<TimelineSection
					lang={lang}
					showSecondary={showSecondary}
					showTertiary={showTertiary}
				/>
			</section>
		</Layout>
	);
});
