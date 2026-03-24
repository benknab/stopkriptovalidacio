import { z } from "zod";
import coalitionsJson from "./coalitions.json" with { type: "json" };

export const repealSupportSchema = z.enum(["for", "against"]);

export type RepealSupport = z.infer<typeof repealSupportSchema>;

export const coalitionSchema = z.enum([
	"A SZOLIDARITÁS PÁRTJA-Munkáspárt",
	"DK",
	"FIDESZ-KDNP",
	"IRÁNY Párt",
	"Jobbik",
	"Középpárt",
	"LMP – Zöldek",
	"MKKP",
	"Magyar Igazság és Élet Pártja",
	"Mi Hazánk",
	"NEEM",
	"NÉP",
	"TISZA",
]);

export type Coalition = z.infer<typeof coalitionSchema>;

const textI18nSchema = z.object({
	hu: z.string(),
	en: z.string(),
});

const coalitionDataSchema = z.object({
	slug: z.string().min(1),
	name: coalitionSchema,
	listRank: z.number().int().positive().nullable(),
	candidateCount: z.number().int().nonnegative(),
	repealSupport: repealSupportSchema.nullable(),
	summary: textI18nSchema.nullable(),
	eventSlug: z.string().nullable(),
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
