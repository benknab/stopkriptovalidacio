import type { JSX } from "preact";
import type { Mp, MpSlug } from "../data/mps.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { MpImage } from "./mp-image.tsx";
import { VoteBadge } from "./vote-badge.tsx";

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

interface MpSelectCardProps {
	slug: MpSlug;
	mp: Mp;
	selected: boolean;
	onToggle: () => void;
	lang: SupportedLanguage;
}

export function MpSelectCard({ slug, mp, selected, onToggle, lang }: MpSelectCardProps): JSX.Element {
	return (
		<button
			type="button"
			onClick={onToggle}
			class={`relative bg-slate-50 rounded-xl p-4 transition-all duration-200 text-left w-full ${
				selected
					? "border-2 border-brand ring-2 ring-brand/20"
					: "border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
			}`}
		>
			{selected && (
				<div class="absolute top-2 right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
					<CheckIcon />
				</div>
			)}

			<div class="flex items-center gap-3">
				<MpImage slug={slug} name={mp.name} size="sm" class="shrink-0" />
				<div class="min-w-0 flex-1">
					<h4 class="font-medium text-slate-900 truncate">{mp.name}</h4>
					<p class="text-sm text-slate-500 truncate">
						{t(`mps.party.${mp.party}`, lang, { defaultValue: mp.party })}
					</p>
				</div>
			</div>

			<div class="mt-3">
				<VoteBadge vote={mp.vote} lang={lang} />
			</div>
		</button>
	);
}
