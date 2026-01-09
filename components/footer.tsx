import type { JSX } from "preact";
import { type SupportedLanguage, t } from "../i18n/index.ts";

interface FooterProps {
	lang: SupportedLanguage;
}

export function Footer({ lang }: FooterProps): JSX.Element {
	return (
		<footer class="bg-slate-900 mt-auto">
			<div class="mx-auto max-w-6xl px-4 sm:px-6 py-12">
				<div class="flex flex-col sm:flex-row sm:justify-between gap-8">
					<div>
						<span class="text-white font-semibold text-lg">
							Stop Kripto Validáció
						</span>
					</div>
					<div>
						<h3 class="text-white font-semibold mb-3">
							{t("nav.about", lang)}
						</h3>
						<div class="space-y-2">
							<a
								href="/rolunk"
								class="block text-slate-400 hover:text-white transition-colors text-sm"
							>
								{t("footer.aboutSite", lang)}
							</a>
							<a
								href="/rolunk#adatvedelem"
								class="block text-slate-400 hover:text-white transition-colors text-sm"
							>
								{t("footer.privacy", lang)}
							</a>
							<a
								href="/rolunk#kontakt"
								class="block text-slate-400 hover:text-white transition-colors text-sm"
							>
								{t("nav.contact", lang)}
							</a>
						</div>
					</div>
				</div>
				<div class="border-t border-slate-700 mt-8 pt-6">
					<p class="text-slate-400 text-sm text-center">
						{t("footer.citizenLed", lang)}
					</p>
				</div>
			</div>
		</footer>
	);
}
