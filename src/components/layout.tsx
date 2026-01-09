import type { JSX, ReactNode } from "react";
import type { SupportedLanguage } from "../i18n/index.ts";
import { Header } from "./header.tsx";
import { Footer } from "./footer.tsx";

interface LayoutProps {
	children: ReactNode;
	currentLang: SupportedLanguage;
	currentPath: string;
	hero?: ReactNode;
	afterContent?: ReactNode;
}

export function Layout({ children, currentLang, currentPath, hero, afterContent }: LayoutProps): JSX.Element {
	return (
		<div className="min-h-screen flex flex-col bg-white text-slate-900">
			<Header currentLang={currentLang} currentPath={currentPath} />
			<main className="flex-1">
				{hero}
				<div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
					{children}
				</div>
				{afterContent}
			</main>
			<Footer />
		</div>
	);
}
