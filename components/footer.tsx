import type { JSX } from "react";
import { type SupportedLanguage, t } from "../i18n/index.ts";

interface FooterProps {
	lang: SupportedLanguage;
}

export function Footer({ lang }: FooterProps): JSX.Element {
	return (
		<footer className="bg-slate-900 mt-auto">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
				<div className="flex flex-col sm:flex-row sm:justify-between gap-8">
					<div>
						<span className="text-white font-semibold text-lg">Stop Kriptovalidáció</span>
					</div>
					<div className="flex flex-wrap items-center gap-6">
						<a href="/rolunk" className="text-slate-400 hover:text-white transition-colors text-sm">
							{t("footer.aboutSite", lang)}
						</a>
						<a href="/rolunk#adatvedelem" className="text-slate-400 hover:text-white transition-colors text-sm">
							{t("footer.privacy", lang)}
						</a>
						<a href="/rolunk#kontakt" className="text-slate-400 hover:text-white transition-colors text-sm">
							{t("nav.contact", lang)}
						</a>
						<a href="/rolunk#kozremukodes" className="text-slate-400 hover:text-white transition-colors text-sm">
							{t("footer.contributions", lang)}
						</a>
					</div>
				</div>
				<div className="border-t border-slate-700 mt-8 pt-6">
					<p className="text-slate-400 text-sm text-center">{t("footer.citizenLed", lang)}</p>
				</div>
			</div>
		</footer>
	);
}
