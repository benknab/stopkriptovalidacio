import { z } from "zod";

export const repealSupportSchema = z.enum(["for", "against", "unknown"]);

export type RepealSupport = z.infer<typeof repealSupportSchema>;

const i18nStringSchema = z.object({
	hu: z.string(),
	en: z.string(),
});

export const stanceSchema = z.object({
	slug: z.string().min(1),
	repealSupport: repealSupportSchema,
	summary: i18nStringSchema,
	email: z.string(),
	facebook: z.string(),
});

export type Stance = z.infer<typeof stanceSchema>;
