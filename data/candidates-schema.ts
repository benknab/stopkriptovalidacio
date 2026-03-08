import { z } from "zod";

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
	statusCode: z.string().min(1),
	status: z.string().min(1),
	statusChangedAt: z.coerce.date(),
	organizationIds: z.array(z.number().int().nonnegative()),
	drawNumber: z.number().int().positive().optional(),
	imageUrl: z.string().url().optional(),
	sourceUrl: z.string().url(),
});

export const candidatesSchema = z.record(z.string(), candidateSchema);

export type Candidate = z.infer<typeof candidateSchema>;
