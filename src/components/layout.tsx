import type { JSX, ReactNode } from "react";
import type { SupportedLanguage } from "../i18n/index.ts";
import { Header } from "./header.tsx";
import { Footer } from "./footer.tsx";

interface LayoutProps {
	children: ReactNode;
	currentLang: SupportedLanguage;
	hero?: ReactNode;
}

export function Layout({ children, currentLang, hero }: LayoutProps): JSX.Element {
	return (
		<div className="min-h-screen flex flex-col bg-white text-slate-900">
			<Header currentLang={currentLang} />
			<main className="flex-1">
				{hero}
				<div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
					{children}
				</div>
			</main>
			<Footer />
		</div>
	);
}
