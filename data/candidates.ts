import { z } from "zod";
import candidatesJson from "./candidates.json" with { type: "json" };

export const repealSupportSchema = z.enum(["for", "against"]);

export type RepealSupport = z.infer<typeof repealSupportSchema>;

const textI18nSchema = z.object({
	hu: z.string(),
	en: z.string(),
});

export const coalitionSchema = z.enum([
	"A Magyar Vállalkozók és",
	"A SZOLIDARITÁS PÁRTJA-Munkáspárt",
	"DK",
	"EgyE",
	"FIDESZ-KDNP",
	"Független jelölt",
	"HHSZ",
	"IRÁNY Párt",
	"Jobbik",
	"Körkeresztesek Pártja",
	"Középpárt",
	"LMP – Zöldek",
	"MHVP",
	"MKKP",
	"Magyar Igazság és Élet Pártja",
	"Mi Hazánk",
	"NEEM",
	"NÉP",
	"OVIP",
	"SZOM",
	"TISZA",
]);

const candidateStatusSchema = z.object({
	code: z.string().min(1),
	label: z.string().min(1),
	changedAt: z.coerce.date(),
});

export const candidateSchema = z.object({
	// Scraper-owned
	slug: z.string().min(1),
	kpnId: z.number().int().positive(),
	ejId: z.number().int().positive(),
	name: z.string().min(1),
	displayName: z.string().min(1),
	coalition: coalitionSchema,
	maz: z.string().regex(/^\d{2}$/),
	evk: z.string().regex(/^\d{2}$/),
	county: z.string().min(1),
	district: z.string().min(1),
	status: candidateStatusSchema,
	organizationIds: z.array(z.number().int().nonnegative()),
	drawNumber: z.number().int().positive().nullable(),
	imageUrl: z.url().nullable(),
	sourceUrl: z.url(),
	// Contact
	emails: z.array(z.string().email()),
	facebook: z.url().nullable(),
	// Stance
	repealSupport: repealSupportSchema.nullable(),
	summary: textI18nSchema.nullable(),
});

const candidatesSchema = z.array(candidateSchema).refine(
	(arr) => new Set(arr.map((c) => c.slug)).size === arr.length,
	{ message: "Duplicate candidate slugs found" },
);

export type Coalition = z.infer<typeof coalitionSchema>;
export type CandidateStatus = z.infer<typeof candidateStatusSchema>;
export type Candidate = z.infer<typeof candidateSchema>;

export const candidates = candidatesSchema.parse(candidatesJson);
export const candidatesBySlug = new Map(candidates.map((c) => [c.slug, c]));
