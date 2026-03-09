import { z } from "zod";
import mpsJson from "./mps.json" with { type: "json" };

const voteTypeSchema = z.enum(["yes", "no", "abstain", "absent", "not_voted", "banned"]);

export type VoteType = z.infer<typeof voteTypeSchema>;

const partySchema = z.enum([
	"Fidesz",
	"KDNP",
	"DK",
	"Momentum",
	"MSZP",
	"Jobbik",
	"Mi Hazánk",
	"Párbeszéd",
	"független",
	"nemzetiségi",
]);

export type Party = z.infer<typeof partySchema>;

export const partyEmails: Partial<Record<Party, string>> = {
	Fidesz: "fidesz@fidesz.hu",
	KDNP: "kdnp@kdnp.hu",
	DK: "info@dkp.hu",
	Jobbik: "jobbik@jobbik.hu",
	"Mi Hazánk": "info@mihazank.hu",
	Momentum: "info@momentum.hu",
	Párbeszéd: "info@parbeszedmagyarorszagert.hu",
	MSZP: "mszp@mszp.hu",
};

export function formatPhoneForDisplay(phone: string): string {
	// Budapest landline: 361 + 7 digits = 10 chars
	if (phone.length === 10 && phone.startsWith("361")) {
		return `+36 1 ${phone.slice(3, 6)} ${phone.slice(6)}`;
	}
	// Regional landline: 36 + 2-digit area code + 6 digits = 10 chars
	if (phone.length === 10 && phone.startsWith("36")) {
		return `+36 ${phone.slice(2, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
	}
	// Mobile: 36 + 2-digit prefix + 7 digits = 11 chars
	if (phone.length === 11 && phone.startsWith("36")) {
		return `+36 ${phone.slice(2, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
	}
	return `+${phone}`;
}

const stringSetSchema = z.array(z.string()).transform((values) => new Set(values));

export const mpSchema = z.object({
	name: z.string(),
	party: partySchema,
	vote: voteTypeSchema,
	emails: stringSetSchema,
	phones: stringSetSchema,
	imageUrl: z.string().optional(),
	district: z.string().optional(),
	website: z.string().optional(),
	address: z.string().optional(),
});

export type Mp = z.infer<typeof mpSchema>;

const mpsSchema = z.record(z.string(), mpSchema);

export const mps = mpsSchema.parse(mpsJson);

export type MpSlug = string;
