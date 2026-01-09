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
	showSecondary?: boolean;
	showTertiary?: boolean;
	mpCounty?: string;
	mpDistrict?: string;
}

export function App({
	showSecondary = true,
	showTertiary = false,
	mpCounty = "",
	mpDistrict = "",
}: AppProps): JSX.Element {
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
			afterContent={<MpsSection selectedCounty={mpCounty} selectedDistrict={mpDistrict} />}
		>
			<section id="idovonal">
				<h2 className="text-xl font-semibold text-slate-900 mb-6">{t("nav.timeline")}</h2>
				<Timeline
					showSecondary={showSecondary}
					showTertiary={showTertiary}
					mpCounty={mpCounty}
					mpDistrict={mpDistrict}
				/>
			</section>
		</Layout>
	);
}
