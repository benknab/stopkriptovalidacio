import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitch } from "./language-switch.tsx";
import type { SupportedLanguage } from "../i18n/index.ts";

export function App(): JSX.Element {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language as SupportedLanguage;

	return (
		<main className="min-h-screen bg-zinc-950 text-zinc-100">
			<div className="mx-auto max-w-4xl px-6 py-12">
				<header className="mb-16 flex items-start justify-between">
					<div>
						<h1 className="text-4xl font-bold tracking-tight">{t("site.title")}</h1>
						<p className="mt-4 text-lg text-zinc-400">{t("site.description")}</p>
					</div>
					<LanguageSwitch currentLang={currentLang} />
				</header>

				<section>
					<h2 className="mb-6 text-2xl font-semibold">{t("nav.timeline")}</h2>
					<p className="text-zinc-400">{t("common.coming_soon")}</p>
				</section>
			</div>
		</main>
	);
}
