import candidatesJson from "./candidates.json" with { type: "json" };
import { candidatesSchema } from "./candidates-schema.ts";

export const candidates = candidatesSchema.parse(candidatesJson);
