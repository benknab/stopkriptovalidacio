import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { events } from "../data/events.ts";
import { type Source, sources } from "../data/sources.ts";
import type { TimelineEvent } from "../data/types.ts";
import type { SupportedLanguage } from "../i18n/index.ts";

function formatDate(date: Date, lang: SupportedLanguage): string {
	return date.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function TimelineSource({ source, lang }: { source: Source; lang: SupportedLanguage }): JSX.Element {
	return (
		<a
			href={source.originalUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1 text-sm text-brand hover:text-brand-hover hover:underline transition-colors"
		>
			<span>{source.title[lang]}</span>
			<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
				/>
			</svg>
		</a>
	);
}

function getDotClassName(type: TimelineEvent["type"]): string {
	switch (type) {
		case "primary":
			return "bg-primary border-primary";
		case "secondary":
			return "bg-primary-light border-primary";
		case "tertiary":
			return "bg-slate-100 border-slate-400";
	}
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
			<div
				className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 ${getDotClassName(event.type)}`}
			/>

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
	showAll?: boolean;
}

export function Timeline({ showAll = false }: TimelineProps): JSX.Element {
	const { i18n } = useTranslation();
	const lang = i18n.language as SupportedLanguage;

	const sortedEvents = Object.entries(events)
		.filter(([, event]) => showAll || event.type !== "tertiary")
		.sort(([, a], [, b]) => b.date.getTime() - a.date.getTime());

	return (
		<div className="space-y-0">
			{sortedEvents.map(([slug, event]) => <TimelineItem key={slug} event={event} lang={lang} />)}
		</div>
	);
}
