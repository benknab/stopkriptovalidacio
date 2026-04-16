import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import type { JSX } from "preact";
import { ExchangesSection } from "../components/exchanges-section.tsx";
import { H2 } from "../components/h2.tsx";
import { Hero } from "../components/hero.tsx";
import { ImpactSection } from "../components/impact-section.tsx";
import { Layout } from "../components/layout.tsx";
import { Link } from "../components/link.tsx";
import { SeoHead } from "../components/seo/seo-head.tsx";
import { detectLanguage, t } from "../i18n/index.ts";
import TimelineSection from "../islands/timeline-section.tsx";
import TakeActionSection from "../islands/take-action-section.tsx";

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
					<ImpactSection lang={lang} />
					<ExchangesSection lang={lang} />
				</>
			}
			afterContent={
				<>
					<TakeActionSection lang={lang} />
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
			<section class="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
				<h3 class="text-xl font-bold text-slate-900 text-balance">
					{t("vote_history.home_title", lang)}
				</h3>
				<p class="mt-3 text-slate-600 max-w-3xl text-balance">
					{t("vote_history.home_description", lang)}
				</p>
				<div class="mt-4">
					<Link href="/szavazas" class="font-medium">
						{t("vote_history.home_link", lang)} →
					</Link>
				</div>
			</section>
		</Layout>
	);
});
