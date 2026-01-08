import type { JSX } from "react";
import { useTranslation } from "react-i18next";

export function Footer(): JSX.Element {
	const { t } = useTranslation();

	return (
		<footer className="border-t border-slate-200 mt-auto">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 flex items-center justify-center">
				<a
					href="/rolunk"
					className="text-sm text-slate-600 hover:text-brand transition-colors"
				>
					{t("nav.about")}
				</a>
			</div>
		</footer>
	);
}
