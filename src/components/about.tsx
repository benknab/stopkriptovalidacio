import type { JSX } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ExternalLink } from "./external-link.tsx";
import { H2 } from "./h2.tsx";
import { Layout } from "./layout.tsx";
import { Link } from "./link.tsx";
import type { SupportedLanguage } from "../i18n/index.ts";

export function About(): JSX.Element {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language as SupportedLanguage;

	return (
		<Layout currentLang={currentLang}>
			<h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">{t("about.title")}</h1>

			{/* Mission Section */}
			<section className="mb-12">
				<H2 className="mb-4 text-left text-2xl sm:text-2xl">{t("about.mission.title")}</H2>
				<div className="space-y-4 text-slate-600 leading-relaxed">
					<p>{t("about.mission.description")}</p>
					<p>{t("about.mission.privacy")}</p>
					<p>{t("about.mission.platform")}</p>
					<p className="font-medium">{t("about.mission.disclaimer")}</p>
				</div>
			</section>

			{/* Privacy Policy Section */}
			<section id="adatvedelem" className="mb-12">
				<H2 className="mb-4 text-left text-2xl sm:text-2xl">{t("about.privacy.title")}</H2>
				<div className="space-y-4 text-slate-600 leading-relaxed">
					<p>
						<Trans
							i18nKey="about.privacy.analytics"
							components={{
								plausibleLink: (
									<ExternalLink href="https://plausible.io/privacy" className="underline" />
								),
							}}
						/>
					</p>
					<p>{t("about.privacy.email")}</p>
					<p>
						<Trans
							i18nKey="about.privacy.cloudflare"
							components={{
								cloudflareLink: (
									<ExternalLink
										href="https://www.cloudflare.com/privacypolicy/"
										className="underline"
									/>
								),
							}}
						/>
					</p>
					<p>{t("about.privacy.changes")}</p>
					<p className="text-sm text-slate-500">{t("about.privacy.updated")}</p>
				</div>
			</section>

			{/* Contact Section */}
			<section id="kontakt">
				<H2 className="mb-4 text-left text-2xl sm:text-2xl">{t("about.contact.title")}</H2>
				<p className="text-slate-600 leading-relaxed mb-4">{t("about.contact.description")}</p>
				<Link href="mailto:info@kriptovalidacio.hu" className="font-mono">
					info@kriptovalidacio.hu
				</Link>
			</section>
		</Layout>
	);
}
