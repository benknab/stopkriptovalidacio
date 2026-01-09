import type { SupportedLanguage } from "../i18n/index.ts";
import { SITE_URL } from "../constants/seo.ts";
import { events } from "../data/events.ts";
import type { TimelineEvent } from "../data/types.ts";

export function buildCanonicalUrl(path: string): string {
	return `${SITE_URL}${path}`;
}

export function buildHreflangUrls(
	path: string,
): Array<{ lang: SupportedLanguage | "x-default"; url: string }> {
	return [
		{ lang: "hu", url: `${SITE_URL}${path}` },
		{ lang: "en", url: `${SITE_URL}${path}` },
		{ lang: "x-default", url: `${SITE_URL}${path}` },
	];
}

export function formatISODate(date: Date): string {
	return date.toISOString().split("T")[0];
}

export function getPrimaryEvents(): Array<[string, TimelineEvent]> {
	return Object.entries(events).filter(([_, event]) => event.type === "primary");
}

export function getLastModifiedDate(): Date {
	const allDates = Object.values(events).map((e) => e.date);
	return new Date(Math.max(...allDates.map((d) => d.getTime())));
}
