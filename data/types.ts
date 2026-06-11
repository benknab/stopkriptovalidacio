import { z } from "zod";

export const textI18nSchema = z.object({
	hu: z.string(),
	en: z.string(),
});

export type TextI18n = z.infer<typeof textI18nSchema>;

export const eventTypeSchema = z.enum(["primary", "secondary", "tertiary", "telegram"]);

export type EventType = z.infer<typeof eventTypeSchema>;

const stringSetSchema = z.array(z.string()).transform((values) => new Set(values));

export const timelineEventSchema = z.object({
	date: z.coerce.date(),
	sortOrder: z.number().optional(),
	type: eventTypeSchema,
	title: textI18nSchema,
	summary: textI18nSchema.optional(),
	text: textI18nSchema.optional(),
	sourceSlugs: stringSetSchema,
	exchangeSlugs: stringSetSchema,
});

export type TimelineEvent = z.infer<typeof timelineEventSchema>;

export const timelineEventsSchema = z.record(z.string(), timelineEventSchema);

export type TimelineEvents = z.infer<typeof timelineEventsSchema>;
