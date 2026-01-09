import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { events } from "../data/events.ts";
import { type Source, sources } from "../data/sources.ts";
import type { EventType, TimelineEvent } from "../data/types.ts";
import type { SupportedLanguage } from "../i18n/index.ts";
import { ExternalLink } from "./external-link.tsx";

function formatDate(date: Date, lang: SupportedLanguage): string {
	return date.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function TimelineSource({ source, lang }: { source: Source; lang: SupportedLanguage }): JSX.Element {
	return (
		<ExternalLink href={source.originalUrl} className="inline-flex items-center gap-1 text-sm hover:underline">
			<span>{source.title[lang]}</span>
			<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
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
			className={`rounded-full border-2 shrink-0 ${dotSizeClasses[size]} ${dotColorClasses[type]}`}
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
		<div className="relative pl-8 pb-8 last:pb-0">
			{/* Vertical line */}
			<div className="absolute left-[11px] top-3 bottom-0 w-px bg-slate-200" />

			{/* Dot */}
			<div className="absolute left-0 top-1.5">
				<TimelineDot type={event.type} />
			</div>

			{/* Content */}
			<div className="space-y-2">
				<time className="text-sm text-slate-500">{formatDate(event.date, lang)}</time>

				<h3 className={`text-lg font-medium ${getTitleClassName(event.type)}`}>
					{event.title[lang]}
				</h3>

				{event.summary && (
					<p
						className="text-slate-600 leading-relaxed"
						dangerouslySetInnerHTML={{ __html: event.summary[lang] }}
					/>
				)}

				{event.sourceSlugs.size > 0 && (
					<div className="flex flex-wrap gap-3 pt-1">
						{[...event.sourceSlugs].map((slug) => (
							<TimelineSource key={slug} source={sources[slug]} lang={lang} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

interface TimelineProps {
	showSecondary?: boolean;
	showTertiary?: boolean;
	mpCounty?: string;
	mpDistrict?: string;
}

export function Timeline({
	showSecondary = true,
	showTertiary = false,
	mpCounty = "",
	mpDistrict = "",
}: TimelineProps): JSX.Element {
	const { t, i18n } = useTranslation();
	const lang = i18n.language as SupportedLanguage;

	const sortedEvents = Object.entries(events)
		.filter(([, event]) => {
			if (event.type === "primary") return true;
			if (event.type === "secondary") return showSecondary;
			if (event.type === "tertiary") return showTertiary;
			return false;
		})
		.sort(([, a], [, b]) => b.date.getTime() - a.date.getTime());

	const filterScript = `
		document.addEventListener('DOMContentLoaded', function() {
			var scrollY = sessionStorage.getItem('timelineScrollY');
			if (scrollY) {
				sessionStorage.removeItem('timelineScrollY');
				window.scrollTo(0, parseInt(scrollY));
			}

			var secondaryCheckbox = document.getElementById('timeline-secondary');
			var tertiaryCheckbox = document.getElementById('timeline-tertiary');

			function updateUrl() {
				var url = new URL(window.location.origin + '/');
				url.hash = 'idovonal';

				// Preserve MP filter params
				${mpCounty ? `url.searchParams.set('megye', '${mpCounty}');` : ""}
				${mpDistrict ? `url.searchParams.set('kerulet', '${mpDistrict}');` : ""}

				if (!secondaryCheckbox.checked) {
					url.searchParams.set('masodlagos', 'false');
				}

				if (tertiaryCheckbox.checked) {
					url.searchParams.set('harmadlagos', 'true');
				}

				sessionStorage.setItem('timelineScrollY', window.scrollY.toString());
				window.location.href = url.toString();
			}

			if (secondaryCheckbox) {
				secondaryCheckbox.addEventListener('change', updateUrl);
			}
			if (tertiaryCheckbox) {
				tertiaryCheckbox.addEventListener('change', updateUrl);
			}
		});
	`;

	return (
		<div>
			<script dangerouslySetInnerHTML={{ __html: filterScript }} />

			{/* Filter checkboxes */}
			<div className="flex flex-wrap gap-4 mb-6">
				<label className="inline-flex items-center gap-2 select-none cursor-default">
					<input
						type="checkbox"
						checked
						disabled
						className="w-4 h-4 rounded border-slate-300 text-brand cursor-default"
					/>
					<TimelineDot type="primary" size="sm" />
					<span className="text-sm text-slate-700">{t("timeline.filter.primary")}</span>
				</label>
				<label className="inline-flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						id="timeline-secondary"
						defaultChecked={showSecondary}
						className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20 cursor-pointer"
					/>
					<TimelineDot type="secondary" size="sm" />
					<span className="text-sm text-slate-700">{t("timeline.filter.related")}</span>
				</label>
				<label className="inline-flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						id="timeline-tertiary"
						defaultChecked={showTertiary}
						className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20 cursor-pointer"
					/>
					<TimelineDot type="tertiary" size="sm" />
					<span className="text-sm text-slate-700">{t("timeline.filter.background")}</span>
				</label>
			</div>

			{/* Timeline events */}
			<div className="space-y-0">
				{sortedEvents.map(([slug, event]) => <TimelineItem key={slug} event={event} lang={lang} />)}
			</div>
		</div>
	);
}
