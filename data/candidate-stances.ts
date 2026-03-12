import { z } from "zod";
import candidateStancesJson from "./candidate-stances.json" with { type: "json" };
import { candidateStanceSchema } from "./stances-schema.ts";

const candidateStancesSchema = z.record(z.string(), candidateStanceSchema);

export const candidateStances = candidateStancesSchema.parse(candidateStancesJson);
