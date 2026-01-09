import type { JSX } from "preact";
import type { VoteType } from "../data/mps.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";

export const voteColors: Record<VoteType, { badge: string; border: string }> = {
	yes: {
		badge: "bg-red-100 text-red-700",
		border: "border-red-400",
	},
	no: {
		badge: "bg-emerald-100 text-emerald-700",
		border: "border-slate-200",
	},
	abstain: {
		badge: "bg-amber-100 text-amber-700",
		border: "border-red-400",
	},
	absent: {
		badge: "bg-slate-100 text-slate-600",
		border: "border-red-400",
	},
	"not_voted": {
		badge: "bg-slate-100 text-slate-600",
		border: "border-red-400",
	},
	banned: {
		badge: "bg-purple-100 text-purple-700",
		border: "border-slate-200",
	},
};

interface VoteBadgeProps {
	vote: VoteType;
	lang: SupportedLanguage;
	class?: string;
}

export function VoteBadge({ vote, lang, class: className }: VoteBadgeProps): JSX.Element {
	const colors = voteColors[vote];
	return (
		<span
			class={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.badge} ${className ?? ""}`}
		>
			{t(`mps.vote.${vote}`, lang)}
		</span>
	);
}
