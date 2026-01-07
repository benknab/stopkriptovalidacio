import type { JSX } from "react";
import type { SupportedLanguage } from "../i18n/index.ts";

interface LanguageSwitchProps {
	currentLang: SupportedLanguage;
}

export function LanguageSwitch({ currentLang }: LanguageSwitchProps): JSX.Element {
	const otherLang: SupportedLanguage = currentLang === "hu" ? "en" : "hu";
	const label = otherLang.toUpperCase();

	return (
		<a
			href={`/set-lang?lang=${otherLang}&redirect=/`}
			className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
		>
			{label}
		</a>
	);
}
