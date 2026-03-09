import { z } from "zod";

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
	party: z.string().min(1),
	maz: z.string().regex(/^\d{2}$/),
	evk: z.string().regex(/^\d{2}$/),
	district: z.string().min(1),
	status: candidateStatusSchema,
	organizationIds: z.array(z.number().int().nonnegative()),
	drawNumber: z.number().int().positive().optional(),
	imageUrl: z.string().url().optional(),
	sourceUrl: z.string().url(),
});

export const candidatesSchema = z.record(z.string(), candidateSchema);

export type CandidateStatus = z.infer<typeof candidateStatusSchema>;
export type Candidate = z.infer<typeof candidateSchema>;
