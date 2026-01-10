import type { JSX } from "preact";
import { type SupportedLanguage, t } from "../i18n/index.ts";

function CheckIcon(): JSX.Element {
	return (
		<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={3}
				d="M5 13l4 4L19 7"
			/>
		</svg>
	);
}

type ColorVariant = "gold" | "silver";

const variantStyles: Record<ColorVariant, { card: string; border: string; checkbox: string }> = {
	gold: {
		card: "bg-amber-50",
		border: "border-amber-500",
		checkbox: "bg-amber-500",
	},
	silver: {
		card: "bg-slate-100",
		border: "border-slate-400",
		checkbox: "bg-slate-500",
	},
};

interface GroupSelectCardProps {
	title: string;
	subtitle: string;
	contactCount: number;
	selected: boolean;
	onToggle: () => void;
	colorVariant: ColorVariant;
	lang: SupportedLanguage;
}

export function GroupSelectCard(props: GroupSelectCardProps): JSX.Element {
	const { title, subtitle, contactCount, selected, onToggle, colorVariant, lang } = props;
	const styles = variantStyles[colorVariant];

	return (
		<button
			type="button"
			onClick={onToggle}
			class={`relative rounded-xl p-4 transition-all duration-200 text-left w-full border-2 ${styles.card} ${
				selected ? `${styles.border} ring-2 ring-current/20` : "border-transparent hover:border-slate-300"
			}`}
		>
			{/* Checkbox indicator */}
			<div
				class={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
					selected ? styles.checkbox : "bg-slate-300"
				}`}
			>
				{selected && <CheckIcon />}
			</div>

			<div class="pr-8">
				<h4 class="font-semibold text-slate-900 text-lg">{title}</h4>
				<p class="text-sm text-slate-600 mt-1">{subtitle}</p>
				<p class="text-sm font-medium text-slate-700 mt-2">
					{t("action.contacts_count", lang, { count: contactCount.toString() })}
				</p>
			</div>
		</button>
	);
}
