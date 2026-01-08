import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "./layout.tsx";
import type { SupportedLanguage } from "../i18n/index.ts";

export function About(): JSX.Element {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language as SupportedLanguage;

	return (
		<Layout currentLang={currentLang}>
			<h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">{t("about.title")}</h1>

			{/* Mission Section */}
			<section className="mb-12">
				<h2 className="text-2xl font-bold text-slate-900 mb-4">{t("about.mission.title")}</h2>
				<div className="space-y-4 text-slate-600 leading-relaxed">
					<p>{t("about.mission.description")}</p>
					<p>{t("about.mission.privacy")}</p>
					<p>{t("about.mission.platform")}</p>
					<p className="font-medium">{t("about.mission.disclaimer")}</p>
				</div>
			</section>

			{/* Contact Section */}
			<section id="kontakt">
				<h2 className="text-2xl font-bold text-slate-900 mb-4">{t("about.contact.title")}</h2>
				<p className="text-slate-600 leading-relaxed mb-4">{t("about.contact.description")}</p>
				<a
					href="mailto:info@kriptovalidacio.hu"
					className="font-mono text-brand hover:text-brand-hover transition-colors"
				>
					info@kriptovalidacio.hu
				</a>
			</section>
		</Layout>
	);
}
