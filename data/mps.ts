import { z } from "zod";
import mpsJson from "./mps.json" with { type: "json" };

const voteTypeSchema = z.enum(["yes", "no", "abstain", "absent", "not_voted", "not_in_parliament", "banned"]);

export type VoteType = z.infer<typeof voteTypeSchema>;
export type MpId = string;
export type MpSlug = string;

export const NATIONAL_LIST = "Országos lista";
export const MINORITY_LIST = "Országos nemzetiségi lista";

const partySchema = z.enum([
	"Fidesz",
	"KDNP",
	"DK",
	"Momentum",
	"MSZP",
	"Jobbik",
	"Mi Hazánk",
	"TISZA",
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

const mpDistrictMandateSchema = z.object({
	type: z.literal("district"),
	party: partySchema,
	district: z.string(),
});

const listLabelSchema = z.union([z.literal(NATIONAL_LIST), z.literal(MINORITY_LIST)]);

const mpListMandateSchema = z.object({
	type: z.literal("list"),
	party: partySchema,
	list: listLabelSchema,
});

export const mpMandateSchema = z.discriminatedUnion("type", [mpDistrictMandateSchema, mpListMandateSchema]);

export type MpMandate = z.infer<typeof mpMandateSchema>;

const electionsSchema = z.record(z.string().regex(/^\d{4}$/), mpMandateSchema);

export const mpSchema = z.object({
	slug: z.string(),
	name: z.string(),
	vote: voteTypeSchema,
	elections: electionsSchema,
	emails: stringSetSchema,
	phones: stringSetSchema,
	imageUrl: z.string().optional(),
	website: z.string().optional(),
	address: z.string().optional(),
});

export type Mp = z.infer<typeof mpSchema>;

const mpsSchema = z.record(z.string().regex(/^\d+$/), mpSchema);

export const mps = mpsSchema.parse(mpsJson);

export function getMandateLabel(mandate: MpMandate): string {
	return mandate.type === "district" ? mandate.district : mandate.list;
}

export function getElectionYears(mp: Mp): number[] {
	return Object.keys(mp.elections)
		.map((year) => Number.parseInt(year, 10))
		.sort((left, right) => left - right);
}

export function getLatestElectionYear(mp: Mp): number | null {
	const years = getElectionYears(mp);
	return years.length > 0 ? years[years.length - 1] : null;
}

export function getMandateForYear(mp: Mp, year: number): MpMandate | null {
	return mp.elections[String(year)] ?? null;
}

export function getLatestMandate(mp: Mp): MpMandate | null {
	const latestYear = getLatestElectionYear(mp);
	return latestYear !== null ? getMandateForYear(mp, latestYear) : null;
}

export function getLatestParty(mp: Mp): Party | null {
	return getLatestMandate(mp)?.party ?? null;
}

export function getLatestDistrictOrList(mp: Mp): string | null {
	const mandate = getLatestMandate(mp);
	return mandate ? getMandateLabel(mandate) : null;
}
