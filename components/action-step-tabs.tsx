import type { JSX } from "preact";
import { type SupportedLanguage, t } from "../i18n/index.ts";

interface ActionStepTabsProps {
	step: 1 | 2;
	lang: SupportedLanguage;
	onStepChange: (step: 1 | 2) => void;
}

export function ActionStepTabs({ step, lang, onStepChange }: ActionStepTabsProps): JSX.Element {
	const activeClasses = "bg-white text-brand";
	const inactiveClasses = "bg-white/20 text-white/80 hover:bg-white/30 hover:text-white";

	return (
		<div class="flex items-center justify-center mt-8 mb-8">
			<button
				type="button"
				onClick={() => onStepChange(1)}
				class={`px-6 py-3 rounded-full font-medium transition-colors cursor-pointer ${
					step === 1 ? activeClasses : inactiveClasses
				}`}
			>
				1. {t("action.step1", lang)}
			</button>
			<div class="w-12 h-0.5 bg-white/30" />
			<button
				type="button"
				onClick={() => onStepChange(2)}
				class={`px-6 py-3 rounded-full font-medium transition-colors cursor-pointer ${
					step === 2 ? activeClasses : inactiveClasses
				}`}
			>
				2. {t("action.step2", lang)}
			</button>
		</div>
	);
}
