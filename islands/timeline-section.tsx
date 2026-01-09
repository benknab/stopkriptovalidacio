import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { events } from "../data/events.ts";
import { type Source, sources } from "../data/sources.ts";
import type { EventType, TimelineEvent } from "../data/types.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { ExternalLink } from "../components/external-link.tsx";

function formatDate(date: Date, lang: SupportedLanguage): string {
	return date.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function TimelineSource({ source, lang }: { source: Source; lang: SupportedLanguage }): JSX.Element {
	return (
		<ExternalLink href={source.originalUrl} class="inline-flex items-center gap-1 text-sm hover:underline">
			<span>{source.title[lang]}</span>
			<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width={2}
					d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
				/>
			</svg>
		</ExternalLink>
	);
}

type DotSize = "sm" | "md";

const dotColorClasses: Record<EventType, string> = {
	primary: "bg-primary border-primary",
	secondary: "bg-primary-light border-primary",
	tertiary: "bg-slate-100 border-slate-400",
};

const dotSizeClasses: Record<DotSize, string> = {
	sm: "w-4 h-4",
	md: "w-6 h-6",
};

interface TimelineDotProps {
	type: EventType;
	size?: DotSize;
}

function TimelineDot({ type, size = "md" }: TimelineDotProps): JSX.Element {
	return (
		<div
			class={`rounded-full border-2 shrink-0 ${dotSizeClasses[size]} ${dotColorClasses[type]}`}
		/>
	);
}

function getTitleClassName(type: TimelineEvent["type"]): string {
	switch (type) {
		case "primary":
			return "text-slate-900";
		case "secondary":
			return "text-slate-800";
		case "tertiary":
			return "text-slate-700";
	}
}

function TimelineItem({
	event,
	lang,
}: {
	event: TimelineEvent;
	lang: SupportedLanguage;
}): JSX.Element {
	return (
		<div class="relative pl-8 pb-8 last:pb-0">
			{/* Vertical line */}
			<div class="absolute left-[11px] top-3 bottom-0 w-px bg-slate-200" />

			{/* Dot */}
			<div class="absolute left-0 top-1.5">
				<TimelineDot type={event.type} />
			</div>

			{/* Content */}
			<div class="space-y-2">
				<time class="text-sm text-slate-500">{formatDate(event.date, lang)}</time>

				<h3 class={`text-lg font-medium ${getTitleClassName(event.type)}`}>
					{event.title[lang]}
				</h3>

				{event.summary && (
					<p
						class="text-slate-600 leading-relaxed"
						// deno-lint-ignore react-no-danger
						dangerouslySetInnerHTML={{ __html: event.summary[lang] }}
					/>
				)}

				{event.sourceSlugs.size > 0 && (
					<div class="flex flex-wrap gap-3 pt-1">
						{[...event.sourceSlugs].map((slug) => (
							<TimelineSource key={slug} source={sources[slug]} lang={lang} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

interface TimelineSectionProps {
	lang: SupportedLanguage;
	showSecondary: boolean;
	showTertiary: boolean;
	mpCounty: string;
	mpDistrict: string;
}

export default function TimelineSection({
	lang,
	showSecondary: initialSecondary,
	showTertiary: initialTertiary,
	mpCounty,
	mpDistrict,
}: TimelineSectionProps): JSX.Element {
	const showSecondary = useSignal(initialSecondary);
	const showTertiary = useSignal(initialTertiary);

	const filteredEvents = Object.entries(events)
		.filter(([, event]) => {
			if (event.type === "primary") return true;
			if (event.type === "secondary") return showSecondary.value;
			if (event.type === "tertiary") return showTertiary.value;
			return false;
		})
		.sort(([, a], [, b]) => b.date.getTime() - a.date.getTime());

	const updateUrl = (): void => {
		const url = new URL(globalThis.location.href);
		url.hash = "idovonal";

		// Preserve MP filter params
		if (mpCounty) url.searchParams.set("megye", mpCounty);
		if (mpDistrict) url.searchParams.set("kerulet", mpDistrict);

		if (!showSecondary.value) {
			url.searchParams.set("masodlagos", "false");
		} else {
			url.searchParams.delete("masodlagos");
		}

		if (showTertiary.value) {
			url.searchParams.set("harmadlagos", "true");
		} else {
			url.searchParams.delete("harmadlagos");
		}

		globalThis.history.pushState({}, "", url);
	};

	return (
		<div>
			{/* Filter checkboxes */}
			<div class="flex flex-wrap gap-4 mb-6">
				<label class="inline-flex items-center gap-2 select-none cursor-default">
					<input
						type="checkbox"
						checked
						disabled
						class="w-4 h-4 rounded border-slate-300 text-brand cursor-default"
					/>
					<TimelineDot type="primary" size="sm" />
					<span class="text-sm text-slate-700">{t("timeline.filter.primary", lang)}</span>
				</label>
				<label class="inline-flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={showSecondary.value}
						onChange={(e): void => {
							showSecondary.value = (e.target as HTMLInputElement).checked;
							updateUrl();
						}}
						class="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20 cursor-pointer"
					/>
					<TimelineDot type="secondary" size="sm" />
					<span class="text-sm text-slate-700">{t("timeline.filter.related", lang)}</span>
				</label>
				<label class="inline-flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={showTertiary.value}
						onChange={(e): void => {
							showTertiary.value = (e.target as HTMLInputElement).checked;
							updateUrl();
						}}
						class="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20 cursor-pointer"
					/>
					<TimelineDot type="tertiary" size="sm" />
					<span class="text-sm text-slate-700">{t("timeline.filter.background", lang)}</span>
				</label>
			</div>

			{/* Timeline events */}
			<div class="space-y-0">
				{filteredEvents.map(([slug, event]) => <TimelineItem key={slug} event={event} lang={lang} />)}
			</div>
		</div>
	);
}
