import type { ExchangeSlug } from "./exchanges.ts";
import type { SourceSlug } from "./sources.ts";

export type TextI18n = {
	hu: string;
	en: string;
};

export type EventType = "primary" | "secondary" | "tertiary" | "telegram";

export type TimelineEvent = {
	date: Date;
	type: EventType;
	title: TextI18n;
	summary?: TextI18n;
	text?: TextI18n;
	sourceSlugs: Set<SourceSlug>;
	exchangeSlugs: Set<ExchangeSlug>;
};

export type TimelineEvents = Record<string, TimelineEvent>;
