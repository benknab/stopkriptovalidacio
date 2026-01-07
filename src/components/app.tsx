import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "./layout.tsx";
import { Timeline } from "./timeline.tsx";
import type { SupportedLanguage } from "../i18n/index.ts";

export function App(): JSX.Element {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language as SupportedLanguage;

	return (
		<Layout currentLang={currentLang}>
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("site.title")}</h1>
				<p className="mt-3 text-lg text-slate-600">{t("site.description")}</p>
			</div>

			<section>
				<h2 className="mb-6 text-xl font-semibold text-slate-900">{t("nav.timeline")}</h2>
				<Timeline />
			</section>
		</Layout>
	);
}
