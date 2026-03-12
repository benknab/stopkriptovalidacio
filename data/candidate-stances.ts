import { z } from "zod";
import candidateStancesJson from "./candidate-stances.json" with { type: "json" };
import { stanceSchema } from "./stances-schema.ts";

const candidateStancesSchema = z.record(z.string(), stanceSchema);

export const candidateStances = candidateStancesSchema.parse(candidateStancesJson);
