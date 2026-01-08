import type { JSX, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "../i18n/index.ts";
import { LanguageSwitch } from "./language-switch.tsx";

interface NavLinkProps {
	href: string;
	children: ReactNode;
}

function NavLink({ href, children }: NavLinkProps): JSX.Element {
	return (
		<a
			href={href}
			className="text-sm font-medium text-slate-600 hover:text-brand transition-colors"
		>
			{children}
		</a>
	);
}

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
						<NavLink href="#attekintes">{t("nav.overview")}</NavLink>
						<NavLink href="#tozsdek">{t("nav.exchanges")}</NavLink>
						<NavLink href="#idovonal">{t("nav.timeline")}</NavLink>
						<NavLink href="#kepviselok">{t("nav.mps")}</NavLink>
					</nav>
				</div>
				<LanguageSwitch currentLang={currentLang} />
			</div>
		</header>
	);
}
