import type { ReactNode, JSX } from "react";
import type { SupportedLanguage } from "../i18n/index.ts";
import { Header } from "./header.tsx";
import { Footer } from "./footer.tsx";

interface LayoutProps {
	children: ReactNode;
	lang: SupportedLanguage;
	currentPath: string;
	hero?: ReactNode;
	afterContent?: ReactNode;
	bgClass?: string;
}

export function Layout({ children, lang, currentPath, hero, afterContent, bgClass }: LayoutProps): JSX.Element {
	return (
		<div className={`min-h-screen flex flex-col ${bgClass ?? "bg-white"} text-slate-900`}>
			<Header lang={lang} currentPath={currentPath} />
			<main className="flex-1 pt-16">
				{hero}
				{children && <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">{children}</div>}
				{afterContent}
			</main>
			<Footer lang={lang} />
		</div>
	);
}
