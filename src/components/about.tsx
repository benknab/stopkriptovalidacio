import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "./layout.tsx";
import type { SupportedLanguage } from "../i18n/index.ts";

export function About(): JSX.Element {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language as SupportedLanguage;

	return (
		<Layout currentLang={currentLang}>
			<h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{t("about.title")}</h1>
			<div className="prose prose-slate max-w-none">
				<p className="text-slate-600 leading-relaxed">{t("about.description")}</p>
			</div>
		</Layout>
	);
}
