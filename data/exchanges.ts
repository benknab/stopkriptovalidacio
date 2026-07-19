import { z } from "zod";
import exchangesJson from "./exchanges.json" with { type: "json" };

const exchangeStatusSchema = z.enum(["operating", "restricted", "uncertain"]);
const exchangeReturnStatusSchema = z.enum(["announced", "returned"]);

export type ExchangeStatus = z.infer<typeof exchangeStatusSchema>;

export const exchangeSchema = z.object({
	name: z.string(),
	status: exchangeStatusSchema,
	returnStatus: exchangeReturnStatusSchema.optional(),
	leaveDate: z.coerce.date().optional(),
});

export type Exchange = z.infer<typeof exchangeSchema>;

const exchangesSchema = z.record(z.string(), exchangeSchema);

export const exchanges = exchangesSchema.parse(exchangesJson);

export type ExchangeSlug = string;
