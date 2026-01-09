import type { ComponentChildren, JSX } from "preact";
import type { SupportedLanguage } from "../i18n/index.ts";
import { Header } from "./header.tsx";
import { Footer } from "./footer.tsx";

interface LayoutProps {
	children: ComponentChildren;
	lang: SupportedLanguage;
	currentPath: string;
	hero?: ComponentChildren;
	afterContent?: ComponentChildren;
}

export function Layout({ children, lang, currentPath, hero, afterContent }: LayoutProps): JSX.Element {
	return (
		<div class="min-h-screen flex flex-col bg-white text-slate-900">
			<Header lang={lang} currentPath={currentPath} />
			<main class="flex-1">
				{hero}
				<div class="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
					{children}
				</div>
				{afterContent}
			</main>
			<Footer lang={lang} />
		</div>
	);
}
