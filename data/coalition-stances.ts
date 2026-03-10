import { z } from "zod";
import coalitionStancesJson from "./coalition-stances.json" with { type: "json" };
import { coalitionSchema } from "./candidates-schema.ts";
import { stanceSchema } from "./stances-schema.ts";

const coalitionStancesSchema = z.record(coalitionSchema, stanceSchema);

export const coalitionStances = coalitionStancesSchema.parse(coalitionStancesJson);
