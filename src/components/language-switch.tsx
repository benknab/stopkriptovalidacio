import type { JSX } from "react";
import type { SupportedLanguage } from "../i18n/index.ts";

interface LanguageSwitchProps {
	currentLang: SupportedLanguage;
}

export function LanguageSwitch({ currentLang }: LanguageSwitchProps): JSX.Element {
	const otherLang: SupportedLanguage = currentLang === "hu" ? "en" : "hu";
	const label = currentLang === "hu" ? "Magyar" : "English";

	return (
		<a
			href={`/set-lang?lang=${otherLang}&redirect=/`}
			className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand transition-colors"
		>
			<span>🌐</span>
			<span>{label}</span>
		</a>
	);
}
