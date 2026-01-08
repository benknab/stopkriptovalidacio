import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { ExchangesSection } from "./exchanges-section.tsx";
import { Hero } from "./hero.tsx";
import { ImpactSection } from "./impact-section.tsx";
import { Layout } from "./layout.tsx";
import { MpsSection } from "./mps-section.tsx";
import { Timeline } from "./timeline.tsx";
import type { SupportedLanguage } from "../i18n/index.ts";

interface AppProps {
	showAllEvents?: boolean;
}

export function App({ showAllEvents = false }: AppProps): JSX.Element {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language as SupportedLanguage;

	return (
		<Layout
			currentLang={currentLang}
			hero={
				<>
					<Hero />
					<ImpactSection />
					<ExchangesSection />
				</>
			}
			afterContent={<MpsSection />}
		>
			<section id="idovonal">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-xl font-semibold text-slate-900">{t("nav.timeline")}</h2>
					<a
						href={showAllEvents ? "/" : "/?osszes=true"}
						className="text-sm text-brand hover:text-brand-hover transition-colors"
					>
						{showAllEvents ? t("timeline.show_primary") : t("timeline.show_all")}
					</a>
				</div>
				<Timeline showAll={showAllEvents} />
			</section>
		</Layout>
	);
}
