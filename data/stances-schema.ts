import { z } from "zod";

export const repealSupportSchema = z.enum(["for", "against", "unknown"]);

export type RepealSupport = z.infer<typeof repealSupportSchema>;

const i18nStringSchema = z.object({
	hu: z.string(),
	en: z.string(),
});

export const stanceSchema = z.object({
	repealSupport: repealSupportSchema,
	summary: i18nStringSchema,
});

export type Stance = z.infer<typeof stanceSchema>;
