import { z } from "zod";
import type { Candidate } from "../data/candidates-schema.ts";

const vtrConfigSchema = z.object({
	ver: z.string().min(1),
});

const rawVtrConstituencySchema = z.object({
	maz: z.string(),
	evk: z.string(),
	"evk_nev": z.string(),
});

const vtrConstituencySchema = rawVtrConstituencySchema.transform((row) => ({
	maz: row.maz,
	evk: row.evk,
	evkName: row["evk_nev"],
}));

const vtrCodeTableSchema = z.object({
	tabla: z.string(),
	kod: z.string(),
	megnev: z.string(),
});

const rawVtrCandidateSchema = z.object({
	"ej_id": z.coerce.number().int(),
	"kpn_id": z.coerce.number().int(),
	maz: z.string(),
	evk: z.string(),
	neve: z.string(),
	"dr_jelzo": z.string().optional(),
	"jlcs_nev": z.string(),
	"jlcs_kod": z.coerce.number().int(),
	"jelolo_szervezetek": z.array(z.coerce.number().int()),
	allapot: z.string(),
	"allapot_valt": z.coerce.date(),
	"sorsolt_sorsz": z.coerce.number().int().optional(),
	fenykep: z.coerce.number().int().optional(),
	"kep_tipus": z.string().optional(),
});

const vtrCandidateSchema = rawVtrCandidateSchema.transform((row) => ({
	ejId: row["ej_id"],
	kpnId: row["kpn_id"],
	maz: row.maz,
	evk: row.evk,
	name: row.neve,
	title: row["dr_jelzo"],
	party: row["jlcs_nev"],
	organizationIds: row["jelolo_szervezetek"],
	statusCode: row.allapot,
	statusChangedAt: row["allapot_valt"],
	drawNumber: row["sorsolt_sorsz"],
	photoId: row.fenykep,
	imageType: row["kep_tipus"],
}));

function createListResponseSchema<TItemSchema extends z.ZodTypeAny>(
	itemSchema: TItemSchema,
): z.ZodObject<{ list: z.ZodArray<TItemSchema> }> {
	return z.object({
		list: z.array(itemSchema),
	});
}

const vtrConstituencyListResponseSchema = createListResponseSchema(vtrConstituencySchema);
const vtrCandidateListResponseSchema = createListResponseSchema(vtrCandidateSchema);
const vtrCodeTableListResponseSchema = createListResponseSchema(vtrCodeTableSchema);

type VtrConstituency = z.infer<typeof vtrConstituencySchema>;
type VtrCandidate = z.infer<typeof vtrCandidateSchema>;
const REGISTERED_STATUS_CODES = new Set(["1", "5"]);

const VTR_BASE_URL = "https://vtr.valasztas.hu/ogy2026";
const VTR_DATA_BASE_URL = `${VTR_BASE_URL}/data`;
const OUTPUT_PATH = new URL("../data/candidates.json", import.meta.url);

async function fetchJson<TSchema extends z.ZodTypeAny>(url: string, schema: TSchema): Promise<z.infer<TSchema>> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Request failed (${response.status}) for ${url}`);
	}

	const payload = await response.json();
	return schema.parse(payload);
}

function buildDistrictKey(maz: string, evk: string): string {
	return `${maz}-${evk}`;
}

function slugifyName(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-{2,}/g, "-");
}

function buildCandidateSlug(name: string, maz: string, evk: string, kpnId: number): string {
	const baseName = slugifyName(name);
	return `${baseName}-${maz}-${evk}-${kpnId}`;
}

function buildImageUrl(photoId?: number, imageType?: string): string | undefined {
	if (!photoId || !imageType) {
		return undefined;
	}

	const photoString = String(photoId).padStart(2, "0");
	const secondLastDigit = photoString[photoString.length - 2];
	const lastDigit = photoString[photoString.length - 1];
	const extension = imageType.toUpperCase();

	return `${VTR_BASE_URL}/kepek/${secondLastDigit}/${lastDigit}/Kep-${photoId}.${extension}`;
}

function pickPreferredRecord(current: VtrCandidate, next: VtrCandidate): VtrCandidate {
	const currentDate = current.statusChangedAt.getTime();
	const nextDate = next.statusChangedAt.getTime();

	if (nextDate > currentDate) {
		return next;
	}

	if (nextDate < currentDate) {
		return current;
	}

	return next.ejId > current.ejId ? next : current;
}

function dedupeCandidates(rows: VtrCandidate[]): VtrCandidate[] {
	const byPersonAndDistrict = new Map<string, VtrCandidate>();

	for (const row of rows) {
		const key = `${row.kpnId}-${row.maz}-${row.evk}`;
		const existing = byPersonAndDistrict.get(key);
		if (!existing) {
			byPersonAndDistrict.set(key, row);
			continue;
		}

		byPersonAndDistrict.set(key, pickPreferredRecord(existing, row));
	}

	return [...byPersonAndDistrict.values()];
}

function toCandidate(
	row: VtrCandidate,
	statusByCode: Map<string, string>,
	constituencyByKey: Map<string, VtrConstituency>,
): Candidate {
	const districtKey = buildDistrictKey(row.maz, row.evk);
	const constituency = constituencyByKey.get(districtKey);
	if (!constituency) {
		throw new Error(`Missing constituency for ${districtKey}`);
	}

	const name = row.name.trim();
	const title = row.title?.trim();
	const displayName = title ? `${title} ${name}` : name;
	const slug = buildCandidateSlug(displayName, row.maz, row.evk, row.kpnId);
	const organizationIds = [...new Set(row.organizationIds)].sort((a, b) => a - b);

	return {
		slug,
		kpnId: row.kpnId,
		ejId: row.ejId,
		name,
		displayName,
		party: row.party,
		maz: row.maz,
		evk: row.evk,
		district: constituency.evkName,
		status: {
			code: row.statusCode,
			label: statusByCode.get(row.statusCode) ?? row.statusCode,
			changedAt: row.statusChangedAt,
		},
		organizationIds,
		drawNumber: row.drawNumber,
		imageUrl: buildImageUrl(row.photoId, row.imageType),
		sourceUrl: `${VTR_BASE_URL}/egyeni-valasztokeruletek/${row.maz}/${row.evk}?tab=jeloltek`,
	};
}

function compareCandidates(a: Candidate, b: Candidate): number {
	if (a.maz !== b.maz) {
		return a.maz.localeCompare(b.maz, "hu");
	}

	if (a.evk !== b.evk) {
		return a.evk.localeCompare(b.evk, "hu");
	}

	if (a.drawNumber && b.drawNumber && a.drawNumber !== b.drawNumber) {
		return a.drawNumber - b.drawNumber;
	}

	if (a.displayName !== b.displayName) {
		return a.displayName.localeCompare(b.displayName, "hu");
	}

	return a.kpnId - b.kpnId;
}

async function main(): Promise<void> {
	const config = await fetchJson(`${VTR_DATA_BASE_URL}/config.json`, vtrConfigSchema);
	const versionDataUrl = `${VTR_DATA_BASE_URL}/${config.ver}/ver`;

	const [constituencyResponse, candidateResponse, codeTableResponse] = await Promise.all([
		fetchJson(`${versionDataUrl}/OevkAdatok.json`, vtrConstituencyListResponseSchema),
		fetchJson(`${versionDataUrl}/EgyeniJeloltek.json`, vtrCandidateListResponseSchema),
		fetchJson(`${versionDataUrl}/Kodtablak.json`, vtrCodeTableListResponseSchema),
	]);

	const statusByCode = new Map<string, string>();
	for (const row of codeTableResponse.list) {
		if (row.tabla === "ALLAPOT") {
			statusByCode.set(row.kod, row.megnev);
		}
	}

	const constituencies = constituencyResponse.list;
	const candidates = candidateResponse.list;

	const constituencyByKey = new Map(
		constituencies.map((constituency) => [buildDistrictKey(constituency.maz, constituency.evk), constituency]),
	);

	const registeredCandidates = dedupeCandidates(candidates)
		.filter((row) => REGISTERED_STATUS_CODES.has(row.statusCode))
		.map((row) => toCandidate(row, statusByCode, constituencyByKey))
		.sort(compareCandidates);

	const candidatesBySlug = Object.fromEntries(registeredCandidates.map((candidate) => [candidate.slug, candidate]));
	const output = `${JSON.stringify(candidatesBySlug, null, "\t")}\n`;

	await Deno.writeTextFile(OUTPUT_PATH, output);

	console.log(`Saved ${registeredCandidates.length} candidates to ${OUTPUT_PATH.pathname}`);
	console.log(`Raw records: ${candidateResponse.list.length}, registered: ${registeredCandidates.length}`);
}

main();
