import type { JSX } from "react";
import type { SupportedLanguage } from "../i18n/index.ts";
import { localizePath } from "../utils/localized-path.ts";

interface LanguageSwitchProps {
	currentLang: SupportedLanguage;
	currentPath: string;
}

export function LanguageSwitch({ currentLang, currentPath }: LanguageSwitchProps): JSX.Element {
	const otherLang: SupportedLanguage = currentLang === "hu" ? "en" : "hu";
	const label = otherLang === "hu" ? "Magyar" : "English";

	return (
		<a
			href={localizePath(currentPath, otherLang)}
			hrefLang={otherLang}
			lang={otherLang}
			onClick={(event) => {
				// Read the fragment at click time so native anchors keep working before hydration.
				event.currentTarget.href = localizePath(currentPath, otherLang) + window.location.hash;
			}}
			className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:border-slate-300 hover:bg-slate-50 transition-colors"
		>
			<span className="text-brand">🌐</span>
			<span>{label}</span>
		</a>
	);
}
