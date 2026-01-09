import type { JSX } from "preact";
import { type SupportedLanguage, t } from "../i18n/index.ts";

interface ActionStepTabsProps {
	step: 1 | 2;
	lang: SupportedLanguage;
}

export function ActionStepTabs({ step, lang }: ActionStepTabsProps): JSX.Element {
	return (
		<div class="flex justify-center gap-4 mt-8 mb-8">
			<div
				class={`px-6 py-3 rounded-lg font-medium transition-colors ${
					step === 1 ? "bg-white text-brand" : "bg-white/10 text-white/70"
				}`}
			>
				1. {t("action.step1", lang)}
			</div>
			<div
				class={`px-6 py-3 rounded-lg font-medium transition-colors ${
					step === 2 ? "bg-white text-brand" : "bg-white/10 text-white/70"
				}`}
			>
				2. {t("action.step2", lang)}
			</div>
		</div>
	);
}
