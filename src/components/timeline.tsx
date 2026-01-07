import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { events } from "../data/events.ts";
import type { Source, TimelineEvent } from "../data/types.ts";
import type { SupportedLanguage } from "../i18n/index.ts";

function formatDate(date: Date, lang: SupportedLanguage): string {
	return date.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function TimelineSource({ source }: { source: Source }): JSX.Element {
	return (
		<a
			href={source.originalUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1 text-sm text-brand hover:text-brand-hover hover:underline transition-colors"
		>
			<span>{source.title}</span>
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

function TimelineItem({
	event,
	lang,
}: {
	event: TimelineEvent;
	lang: SupportedLanguage;
}): JSX.Element {
	const isPrimary = event.type === "primary";

	return (
		<div className="relative pl-8 pb-8 last:pb-0">
			{/* Vertical line */}
			<div className="absolute left-[11px] top-3 bottom-0 w-px bg-slate-200" />

			{/* Dot */}
			<div
				className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 ${
					isPrimary ? "bg-primary-light border-primary" : "bg-slate-100 border-slate-400"
				}`}
			/>

			{/* Content */}
			<div className="space-y-2">
				<time className="text-sm text-slate-500">{formatDate(event.date, lang)}</time>

				<h3 className={`text-lg font-medium ${isPrimary ? "text-slate-900" : "text-slate-700"}`}>
					{event.title[lang]}
				</h3>

				<p className="text-slate-600 leading-relaxed">{event.summary[lang]}</p>

				{event.sources.length > 0 && (
					<div className="flex flex-wrap gap-3 pt-1">
						{event.sources.map((source, i) => <TimelineSource key={i} source={source} />)}
					</div>
				)}
			</div>
		</div>
	);
}

export function Timeline(): JSX.Element {
	const { i18n } = useTranslation();
	const lang = i18n.language as SupportedLanguage;

	const sortedEvents = Object.entries(events).sort(([, a], [, b]) => b.date.getTime() - a.date.getTime());

	return (
		<div className="space-y-0">
			{sortedEvents.map(([slug, event]) => <TimelineItem key={slug} event={event} lang={lang} />)}
		</div>
	);
}
