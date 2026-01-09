import type { JSX } from "preact";
import type { SupportedLanguage } from "../i18n/index.ts";

interface LanguageSwitchProps {
	currentLang: SupportedLanguage;
	currentPath: string;
}

export function LanguageSwitch({ currentLang, currentPath }: LanguageSwitchProps): JSX.Element {
	const otherLang: SupportedLanguage = currentLang === "hu" ? "en" : "hu";
	const label = otherLang === "hu" ? "Magyar" : "English";

	return (
		<a
			href={`/set-lang?lang=${otherLang}&redirect=${encodeURIComponent(currentPath)}`}
			class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:border-slate-300 hover:bg-slate-50 transition-colors"
		>
			<span class="text-brand">🌐</span>
			<span>{label}</span>
		</a>
	);
}
