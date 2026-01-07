import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "../i18n/index.ts";
import { LanguageSwitch } from "./language-switch.tsx";

interface HeaderProps {
	currentLang: SupportedLanguage;
}

export function Header({ currentLang }: HeaderProps): JSX.Element {
	const { t } = useTranslation();

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-slate-200">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-between">
				<div className="flex items-center gap-8">
					<a href="/" className="text-xl font-bold text-slate-900 hover:text-brand transition-colors">
						Kriptovalidáció
					</a>
					<nav className="hidden sm:flex items-center gap-6">
						<a
							href="#attekintes"
							className="text-sm font-medium text-slate-600 hover:text-brand transition-colors"
						>
							{t("nav.overview")}
						</a>
						<a
							href="#idovonal"
							className="text-sm font-medium text-slate-600 hover:text-brand transition-colors"
						>
							{t("nav.timeline")}
						</a>
					</nav>
				</div>
				<LanguageSwitch currentLang={currentLang} />
			</div>
		</header>
	);
}
