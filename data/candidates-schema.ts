import { z } from "zod";

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

export const candidateStatusSchema = z.object({
	code: z.string().min(1),
	label: z.string().min(1),
	changedAt: z.coerce.date(),
});

export const candidateSchema = z.object({
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
	drawNumber: z.number().int().positive().optional(),
	imageUrl: z.url().optional(),
	sourceUrl: z.url(),
});

export const candidatesSchema = z.record(z.string(), candidateSchema);

export type Coalition = z.infer<typeof coalitionSchema>;
export type CandidateStatus = z.infer<typeof candidateStatusSchema>;
export type Candidate = z.infer<typeof candidateSchema>;
