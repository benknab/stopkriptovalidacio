import type { ComponentChildren, JSX } from "preact";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { LanguageSwitch } from "./language-switch.tsx";

interface NavLinkProps {
	href: string;
	children: ComponentChildren;
}

function NavLink({ href, children }: NavLinkProps): JSX.Element {
	return (
		<a
			href={href}
			class="text-sm font-medium text-slate-600 hover:text-brand transition-colors"
		>
			{children}
		</a>
	);
}

interface HeaderProps {
	lang: SupportedLanguage;
	currentPath: string;
}

export function Header({ lang, currentPath }: HeaderProps): JSX.Element {
	return (
		<header class="sticky top-0 z-50 bg-white border-b border-slate-200">
			<div class="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
				<a href="/" class="text-xl font-bold text-slate-900 hover:text-brand transition-colors">
					Stop Kripto Validáció
				</a>
				<div class="flex items-center gap-6">
					<nav class="hidden sm:flex items-center gap-6">
						<NavLink href="/#attekintes">{t("nav.overview", lang)}</NavLink>
						<NavLink href="/#tozsdek">{t("nav.exchanges", lang)}</NavLink>
						<NavLink href="/#idovonal">{t("nav.timeline", lang)}</NavLink>
						<NavLink href="/#kepviselok">{t("nav.mps", lang)}</NavLink>
						<NavLink href="/#cselekedj">{t("action.nav_title", lang)}</NavLink>
					</nav>
					<LanguageSwitch currentLang={lang} currentPath={currentPath} />
				</div>
			</div>
		</header>
	);
}
