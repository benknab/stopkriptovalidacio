import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "./layout.tsx";
import { Timeline } from "./timeline.tsx";
import type { SupportedLanguage } from "../i18n/index.ts";

interface AppProps {
	showAllEvents?: boolean;
}

export function App({ showAllEvents = false }: AppProps): JSX.Element {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language as SupportedLanguage;

	return (
		<Layout currentLang={currentLang}>
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("site.title")}</h1>
				<p className="mt-3 text-lg text-slate-600">{t("site.description")}</p>
			</div>

			<section>
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-xl font-semibold text-slate-900">{t("nav.timeline")}</h2>
					<a
						href={showAllEvents ? "/" : "/?osszes=true"}
						className="text-sm text-brand hover:text-brand-hover transition-colors"
					>
						{showAllEvents ? t("timeline.show_primary") : t("timeline.show_all")}
					</a>
				</div>
				<Timeline showAll={showAllEvents} />
			</section>
		</Layout>
	);
}
