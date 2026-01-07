import type { JSX } from "react";
import type { SupportedLanguage } from "../i18n/index.ts";
import { LanguageSwitch } from "./language-switch.tsx";

interface HeaderProps {
	currentLang: SupportedLanguage;
}

export function Header({ currentLang }: HeaderProps): JSX.Element {
	return (
		<header className="border-b border-slate-200">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 flex items-center justify-between">
				<a href="/" className="text-xl font-bold text-slate-900 hover:text-brand transition-colors">
					Kriptovalidáció
				</a>
				<LanguageSwitch currentLang={currentLang} />
			</div>
		</header>
	);
}
