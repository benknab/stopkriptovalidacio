import type { ComponentChildren, JSX } from "preact";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { MobileNav } from "../islands/mobile-nav.tsx";
import { LanguageSwitch } from "./language-switch.tsx";

interface NavLinkProps {
	anchor: string;
	currentPath: string;
	children: ComponentChildren;
}

function getAnchorHref(anchor: string, currentPath: string): string {
	const isHomePage = currentPath === "/" || currentPath.startsWith("/?");
	return isHomePage ? `#${anchor}` : `/#${anchor}`;
}

function NavLink({ anchor, currentPath, children }: NavLinkProps): JSX.Element {
	return (
		<a
			href={getAnchorHref(anchor, currentPath)}
			class="text-sm font-medium text-slate-600 hover:text-brand transition-colors"
		>
			{children}
		</a>
	);
}

function NavCta({ anchor, currentPath, children }: NavLinkProps): JSX.Element {
	return (
		<a
			href={getAnchorHref(anchor, currentPath)}
			class="text-sm font-semibold text-white bg-brand px-4 py-2 rounded-lg hover:bg-brand-hover transition-colors"
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
		<header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
			<div class="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
				<a href="/" class="text-xl font-bold text-slate-900 hover:text-brand transition-colors">
					Stop Kriptovalidáció
				</a>
				<div class="flex items-center gap-4 sm:gap-6">
					<nav class="hidden sm:flex items-center gap-6">
						<NavLink anchor="attekintes" currentPath={currentPath}>{t("nav.overview", lang)}</NavLink>
						<NavLink anchor="tozsdek" currentPath={currentPath}>{t("nav.exchanges", lang)}</NavLink>
						<NavLink anchor="idovonal" currentPath={currentPath}>{t("nav.timeline", lang)}</NavLink>
						<NavCta anchor="cselekedj" currentPath={currentPath}>{t("action.nav_title", lang)}</NavCta>
					</nav>
					<div class="hidden sm:block">
						<LanguageSwitch currentLang={lang} currentPath={currentPath} />
					</div>
					<MobileNav lang={lang} currentPath={currentPath} />
				</div>
			</div>
		</header>
	);
}
