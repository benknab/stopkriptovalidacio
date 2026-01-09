import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { ExchangesSection } from "./exchanges-section.tsx";
import { H2 } from "./h2.tsx";
import { Hero } from "./hero.tsx";
import { ImpactSection } from "./impact-section.tsx";
import { Layout } from "./layout.tsx";
import { MpsSection } from "./mps-section.tsx";
import { Timeline } from "./timeline.tsx";
import type { SupportedLanguage } from "../i18n/index.ts";

interface AppProps {
	currentPath: string;
	showSecondary?: boolean;
	showTertiary?: boolean;
	mpCounty?: string;
	mpDistrict?: string;
}

export function App({
	currentPath,
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
			currentPath={currentPath}
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
				<H2 className="mb-6">{t("nav.timeline")}</H2>
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
