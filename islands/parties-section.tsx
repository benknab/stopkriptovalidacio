import { useSignal } from "@preact/signals";
import type { JSX } from "preact";
import { candidates, type Coalition, coalitionSchema, type RepealSupport } from "../data/candidates.ts";
import { coalitionsByName } from "../data/coalitions.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { H2 } from "../components/h2.tsx";

// --- Stance colors (border + badge) ---

const stanceColors: Record<RepealSupport, { border: string; badge: string }> = {
	for: {
		border: "border-emerald-400",
		badge: "bg-emerald-100 text-emerald-700",
	},
	against: {
		border: "border-red-400",
		badge: "bg-red-100 text-red-700",
	},
	unknown: {
		border: "border-slate-200",
		badge: "bg-slate-100 text-slate-600",
	},
};

const stancePriority: Record<RepealSupport, number> = {
	for: 0,
	against: 1,
	unknown: 2,
};

// --- Compute which coalitions have candidates ---

const INDEPENDENT_COALITION: Coalition = "Független jelölt";
const MAIN_THRESHOLD = 40;

function getPartiesWithCandidates(): Array<{ coalition: Coalition; candidateCount: number }> {
	const coalitionSet = new Set(coalitionSchema.options);
	const counts = new Map<Coalition, number>();

	for (const candidate of candidates) {
		if (!coalitionSet.has(candidate.coalition)) continue;
		if (candidate.coalition === INDEPENDENT_COALITION) continue;
		counts.set(candidate.coalition, (counts.get(candidate.coalition) ?? 0) + 1);
	}

	return Array.from(counts.entries())
		.filter(([_, count]) => count >= 1)
		.map(([coalition, candidateCount]) => ({ coalition, candidateCount }))
		.sort((a, b) => {
			const stanceA = coalitionsByName.get(a.coalition)?.repealSupport ?? "unknown";
			const stanceB = coalitionsByName.get(b.coalition)?.repealSupport ?? "unknown";
			const priorityDiff = stancePriority[stanceA] - stancePriority[stanceB];
			if (priorityDiff !== 0) return priorityDiff;
			return b.candidateCount - a.candidateCount;
		});
}

const allParties = getPartiesWithCandidates();
const mainParties = allParties.filter((p) => p.candidateCount >= MAIN_THRESHOLD);
const extraParties = allParties.filter((p) => p.candidateCount < MAIN_THRESHOLD);

// --- Icons ---

function EmailIcon(): JSX.Element {
	return (
		<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
			/>
		</svg>
	);
}

function FacebookIcon(): JSX.Element {
	return (
		<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
			<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
		</svg>
	);
}

// --- Party Card ---

interface PartyCardProps {
	coalition: Coalition;
	candidateCount: number;
	lang: SupportedLanguage;
}

function PartyCard({ coalition, candidateCount, lang }: PartyCardProps): JSX.Element {
	const stance = coalitionsByName.get(coalition);
	const slug = stance?.slug ?? "";
	const repealSupport = stance?.repealSupport ?? "unknown";
	const colors = stanceColors[repealSupport];
	const summary = stance?.summary?.[lang] ?? "";

	const emails = stance?.emails ?? [];
	const facebook = stance?.facebook ?? "";

	return (
		<div
			class={`bg-white rounded-xl border-2 ${colors.border} p-5 transition-all duration-200 hover:shadow-md flex flex-col`}
		>
			{/* Stance Badge */}
			<div class="flex justify-end mb-3">
				<span
					class={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.badge}`}
				>
					{t(`candidates.stance.${repealSupport}`, lang)}
				</span>
			</div>

			{/* Logo */}
			{slug && (
				<div class="flex justify-center mb-3">
					<img
						src={`/parties/${slug}.png`}
						alt={coalition}
						class="h-12 w-auto object-contain"
						loading="lazy"
					/>
				</div>
			)}

			{/* Content */}
			<div class="flex-1 space-y-1 text-center">
				<h3 class="font-bold text-slate-900 text-lg leading-tight">{coalition}</h3>
				<p class="text-sm text-slate-500">
					{t("parties.candidates_count", lang, { count: String(candidateCount) })}
				</p>
			</div>

			{/* Summary */}
			{summary && (
				<p class="mt-3 text-sm text-slate-600 text-center leading-relaxed">
					{summary}
				</p>
			)}

			{/* Button Row */}
			<div class="flex gap-2 mt-4">
				{emails.length > 0
					? (
						<a
							href={`mailto:${emails.join(",")}`}
							class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
						>
							<EmailIcon />
							{t("parties.email", lang)}
						</a>
					)
					: (
						<span class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
							<EmailIcon />
							{t("parties.email", lang)}
						</span>
					)}
				{facebook
					? (
						<a
							href={facebook}
							target="_blank"
							rel="noopener noreferrer"
							class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
						>
							<FacebookIcon />
							{t("parties.facebook", lang)}
						</a>
					)
					: (
						<span class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
							<FacebookIcon />
							{t("parties.facebook", lang)}
						</span>
					)}
			</div>
		</div>
	);
}

// --- Section ---

interface PartiesSectionProps {
	lang: SupportedLanguage;
}

const INITIAL_COLLAPSED = false;

export default function PartiesSection({ lang }: PartiesSectionProps): JSX.Element {
	const showAll = useSignal(INITIAL_COLLAPSED);

	const visibleParties = showAll.value ? allParties : mainParties;
	const hasExtra = extraParties.length > 0;

	return (
		<section id="valasztas-2026" class="bg-slate-50 py-10 sm:py-12">
			<div class="mx-auto max-w-6xl px-4 sm:px-6">
				<H2>{t("parties.title", lang)}</H2>
				<div class="mt-2 text-center space-y-2">
					<p class="text-slate-600 text-balance">
						{t("parties.description", lang)}
					</p>
					<p class="text-sm text-slate-500 text-balance">
						{t("parties.methodology", lang)}
					</p>
					<p class="text-sm text-slate-500 italic text-balance">
						{t("parties.outreach", lang)}
					</p>
				</div>

				<div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{visibleParties.map(({ coalition, candidateCount }) => (
						<PartyCard
							key={coalition}
							coalition={coalition}
							candidateCount={candidateCount}
							lang={lang}
						/>
					))}
				</div>

				{/* Threshold note + show all button */}
				{hasExtra && (
					<div class="mt-8 text-center">
						<p class="text-sm text-slate-500">
							{t("parties.threshold_note", lang)}
						</p>
						<button
							type="button"
							onClick={() => {
								showAll.value = !showAll.value;
							}}
							class="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
						>
							{showAll.value ? t("parties.show_fewer", lang) : t("parties.show_all", lang)}
							<svg
								class={`w-4 h-4 transition-transform duration-200 ${showAll.value ? "rotate-180" : ""}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
					</div>
				)}
			</div>
		</section>
	);
}
