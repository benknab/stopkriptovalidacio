import { z } from "zod";
import coalitionsJson from "./coalitions.json" with { type: "json" };
import { coalitionSchema, repealSupportSchema } from "./candidates.ts";

const textI18nSchema = z.object({
	hu: z.string(),
	en: z.string(),
});

const coalitionDataSchema = z.object({
	slug: z.string().min(1),
	name: coalitionSchema,
	repealSupport: repealSupportSchema.nullable(),
	summary: textI18nSchema.nullable(),
	emails: z.array(z.string().email()),
	facebook: z.url().nullable(),
});

const coalitionsSchema = z.array(coalitionDataSchema).refine(
	(arr) => new Set(arr.map((c) => c.slug)).size === arr.length,
	{ message: "Duplicate coalition slugs found" },
);

export type CoalitionData = z.infer<typeof coalitionDataSchema>;

export const coalitions = coalitionsSchema.parse(coalitionsJson);
export const coalitionsBySlug = new Map(coalitions.map((c) => [c.slug, c]));
export const coalitionsByName = new Map(coalitions.map((c) => [c.name, c]));
