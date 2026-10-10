import type { SyntheticEvent } from "react";
import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { useElementScrollRestoration, useHydrated } from "@tanstack/react-router";
import { BUILD_DATE } from "../constants/build.ts";
import { ExternalLink } from "../components/external-link.tsx";
import { TelegramIcon } from "../components/telegram-icon.tsx";
import { TELEGRAM_CHANNEL_URL } from "../constants/seo.ts";
import { events } from "../data/events.ts";
import { type Source, sources } from "../data/sources.ts";
import type { EventType, TimelineEvent } from "../data/types.ts";
import { useBooleanQueryParam } from "../hooks/use-root-query-params.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { localizePath } from "../utils/localized-path.ts";

function formatDate(date: Date, lang: SupportedLanguage): string {
	return date.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "Europe/Budapest",
	});
}

function getTodayInBudapest(date: Date): Date {
	return new Date(date.toLocaleDateString("en-CA", { timeZone: "Europe/Budapest" }));
}

function TimelineSource({
	slug,
	source,
	lang,
}: {
	slug: string;
	source: Source;
	lang: SupportedLanguage;
}): JSX.Element | null {
	if (source.internalUrl) {
		return (
			<a
				href={localizePath(source.internalUrl, lang)}
				className="inline-flex items-center gap-1 text-sm text-brand hover:text-brand-hover transition-colors hover:underline"
			>
				<span>{source.title[lang]}</span>
				<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			</a>
		);
	}

	if (source.originalUrl) {
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

	// First-party source: link to internal source detail page
	if (source.summary || source.text) {
		return (
			<a
				href={localizePath(`/forras/${slug}`, lang)}
				className="inline-flex items-center gap-1 text-sm text-brand hover:text-brand-hover transition-colors hover:underline"
			>
				<span>{source.title[lang]}</span>
				<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			</a>
		);
	}

	return null;
}

type DotSize = "sm" | "md";

const dotColorClasses: Partial<Record<EventType, string>> = {
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
	return <div className={`rounded-full border-2 shrink-0 ${dotSizeClasses[size]} ${dotColorClasses[type] ?? ""}`} />;
}

function getTitleClassName(type: TimelineEvent["type"]): string {
	switch (type) {
		case "primary":
			return "text-slate-900";
		case "secondary":
			return "text-slate-800";
		case "tertiary":
			return "text-slate-700";
		default:
			return "text-slate-700";
	}
}

function TimelineItem({
	slug,
	event,
	lang,
}: {
	slug: string;
	event: TimelineEvent;
	lang: SupportedLanguage;
}): JSX.Element {
	return (
		<div id={slug} className="relative pl-8 pb-8 last:pb-0 scroll-mt-24">
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
					<a href={`#${slug}`} className="hover:underline underline-offset-2">
						{event.title[lang]}
					</a>
				</h3>

				{event.summary && (
					<p className="text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: event.summary[lang] }} />
				)}

				{event.sourceSlugs.size > 0 && (
					<div className="flex flex-wrap gap-3 pt-1">
						{[...event.sourceSlugs].map((sourceSlug) => (
							<TimelineSource key={sourceSlug} slug={sourceSlug} source={sources[sourceSlug]} lang={lang} />
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
}

export default function TimelineSection(props: TimelineSectionProps): JSX.Element {
	const { lang } = props;
	const hydrated = useHydrated();
	const scrollRestoration = useElementScrollRestoration({
		getElement: () => (typeof window === "undefined" ? undefined : window),
	});
	// Capture the destination entry before subsequent filter/hash navigations
	// update the router's cache. This effect only corrects the initial hydration.
	const savedScroll = useRef(scrollRestoration).current;
	const today = getTodayInBudapest(hydrated ? new Date() : BUILD_DATE);
	const [showSecondary, setShowSecondary] = useBooleanQueryParam({
		key: "masodlagos",
		defaultValue: true,
		initialValue: props.showSecondary,
	});
	const [showTertiary, setShowTertiary] = useBooleanQueryParam({
		key: "harmadlagos",
		defaultValue: false,
		initialValue: props.showTertiary,
	});

	useEffect(() => {
		if (!hydrated) return;
		const navigation = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
		if (navigation?.type === "back_forward") {
			// A history reload restores against the shorter static timeline before
			// filters hydrate. Retry the saved position, not the original fragment:
			// the reader may have scrolled away from that event before leaving.
			if (!savedScroll) return;
			const frame = requestAnimationFrame(() => {
				window.scrollTo({ left: savedScroll.scrollX, top: savedScroll.scrollY, behavior: "instant" });
			});
			return () => cancelAnimationFrame(frame);
		}
		let slug: string;
		try {
			slug = decodeURIComponent(window.location.hash.slice(1));
		} catch {
			return;
		}
		if (!Object.hasOwn(events, slug)) return;
		const target = document.getElementById(slug);
		if (!target) return;
		// Filtered events may not exist during the browser's initial fragment scroll.
		// Wait until hydration and the router's initial scroll restoration have finished.
		const frame = requestAnimationFrame(() => {
			target.scrollIntoView({ block: "start", behavior: "instant" });
		});
		return () => cancelAnimationFrame(frame);
	}, [hydrated, savedScroll]);

	const filteredEvents = Object.entries(events)
		.filter(([, event]) => {
			if (event.date > today) return false;
			if (event.type === "telegram") return false;
			if (event.type === "primary") return true;
			if (event.type === "secondary") return showSecondary;
			if (event.type === "tertiary") return showTertiary;
			return false;
		})
		.sort(([, a], [, b]) => {
			const dateDiff = b.date.getTime() - a.date.getTime();
			if (dateDiff !== 0) return dateDiff;

			return (b.sortOrder ?? 0) - (a.sortOrder ?? 0);
		});

	function handleSecondaryChange(e: SyntheticEvent): void {
		setShowSecondary((e.target as HTMLInputElement).checked);
	}

	function handleTertiaryChange(e: SyntheticEvent): void {
		setShowTertiary((e.target as HTMLInputElement).checked);
	}

	return (
		<div>
			{/* Telegram CTA */}
			<div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg flex items-center gap-3">
				<TelegramIcon className="w-6 h-6 text-sky-500 shrink-0" />
				<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
					<span className="text-slate-700 font-medium">{t("timeline.telegram_cta", lang)}</span>
					<ExternalLink
						href={TELEGRAM_CHANNEL_URL}
						className="text-sky-600 hover:text-sky-700 hover:underline font-semibold"
					>
						@stopkriptovalidacio
					</ExternalLink>
				</div>
			</div>

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
					<span className="text-sm text-slate-700">{t("timeline.filter.primary", lang)}</span>
				</label>
				<label className="inline-flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={showSecondary}
						onChange={handleSecondaryChange}
						className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20 cursor-pointer"
					/>
					<TimelineDot type="secondary" size="sm" />
					<span className="text-sm text-slate-700">{t("timeline.filter.related", lang)}</span>
				</label>
				<label className="inline-flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={showTertiary}
						onChange={handleTertiaryChange}
						className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand/20 cursor-pointer"
					/>
					<TimelineDot type="tertiary" size="sm" />
					<span className="text-sm text-slate-700">{t("timeline.filter.background", lang)}</span>
				</label>
			</div>

			{/* Timeline events */}
			<div className="space-y-0">
				{filteredEvents.map(([slug, event]) => (
					<TimelineItem key={slug} slug={slug} event={event} lang={lang} />
				))}
			</div>
		</div>
	);
}
