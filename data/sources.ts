import { z } from "zod";
import sourcesJson from "./sources.json" with { type: "json" };
import { textI18nSchema } from "./types.ts";

export const sourceSchema = z.object({
	title: textI18nSchema,
	originalUrl: z.string().optional(),
	archivedUrl: z.string().optional(),
	summary: textI18nSchema.optional(),
	text: textI18nSchema.optional(),
});

export type Source = z.infer<typeof sourceSchema>;

const sourcesSchema = z.record(z.string(), sourceSchema);

export const sources = sourcesSchema.parse(sourcesJson);

export type SourceSlug = string;
