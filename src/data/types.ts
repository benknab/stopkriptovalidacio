export type TextI18n = {
	hu: string;
	en: string;
};

export type EventType = "primary" | "secondary";

export type Source = {
	title: string;
	originalUrl: string;
	archivedUrl?: string;
};

export type TimelineEvent = {
	date: Date;
	type: EventType;
	title: TextI18n;
	summary?: TextI18n;
	text?: TextI18n;
	sources: Source[];
};

export type TimelineEvents = Record<string, TimelineEvent>;
