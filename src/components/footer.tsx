import type { JSX } from "react";
import { useTranslation } from "react-i18next";

export function Footer(): JSX.Element {
	const { t } = useTranslation();

	return (
		<footer className="bg-slate-900 mt-auto">
			<div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
				<div className="flex flex-col sm:flex-row sm:justify-between gap-8">
					<div>
						<span className="text-white font-semibold text-lg">
							Kriptóvalidáció
						</span>
					</div>
					<div>
						<h3 className="text-white font-semibold mb-3">
							{t("nav.about")}
						</h3>
						<a
							href="/rolunk"
							className="text-slate-400 hover:text-white transition-colors text-sm"
						>
							{t("footer.aboutSite")}
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
