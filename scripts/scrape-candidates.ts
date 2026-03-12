import { z } from "zod";
import { type Candidate, coalitionSchema } from "../data/candidates.ts";

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
	"jlcs_nev": coalitionSchema,
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
	coalition: row["jlcs_nev"],
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
const JOGEROS_STATUS_CODES = new Set(["1"]);

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

function isInitial(word: string): boolean {
	return word.length <= 3 && word.endsWith(".");
}

function capitalizeWord(word: string): string {
	if (word === "DR.") {
		return "Dr.";
	}

	if (isInitial(word)) {
		return word;
	}

	const parts = word.split("-");
	if (parts.length > 1) {
		return parts.map(capitalizeWord).join("-");
	}

	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function capitalizeName(uppercaseName: string): string {
	return uppercaseName.split(" ").map(capitalizeWord).join(" ");
}

function capitalizeTitle(uppercaseTitle: string): string {
	return capitalizeWord(uppercaseTitle);
}

function buildCandidateSlug(name: string, ejId: number): string {
	const baseName = slugifyName(name);
	return `${baseName}-${ejId}`;
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

function formatEvkName(evkName: string): { county: string; district: string } {
	const commaIndex = evkName.indexOf(",");
	if (commaIndex === -1) {
		return { county: evkName, district: "" };
	}

	const rawCounty = evkName.substring(0, commaIndex)
		.replace(/ vármegye$/, "")
		.replace(/ főváros$/, "");

	const rawDistrict = evkName.substring(commaIndex + 2);
	const numMatch = rawDistrict.match(/^(\d+\.)/);
	const district = numMatch ? `${numMatch[1]} OEVK` : rawDistrict;

	return { county: rawCounty, district };
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
	existingBySlug: Map<string, Candidate>,
): Candidate {
	const districtKey = buildDistrictKey(row.maz, row.evk);
	const constituency = constituencyByKey.get(districtKey);
	if (!constituency) {
		throw new Error(`Missing constituency for ${districtKey}`);
	}

	const name = capitalizeName(row.name.trim());
	const title = row.title?.trim();
	const displayName = title ? `${capitalizeTitle(title)} ${name}` : name;
	const slug = buildCandidateSlug(displayName, row.ejId);
	const organizationIds = [...new Set(row.organizationIds)].sort((a, b) => a - b);

	const { county, district } = formatEvkName(constituency.evkName);

	// Preserve manually curated fields from existing data
	const existing = existingBySlug.get(slug);

	return {
		slug,
		kpnId: row.kpnId,
		ejId: row.ejId,
		name,
		displayName,
		coalition: row.coalition,
		maz: row.maz,
		evk: row.evk,
		county,
		district,
		status: {
			code: row.statusCode,
			label: statusByCode.get(row.statusCode) ?? row.statusCode,
			changedAt: row.statusChangedAt,
		},
		organizationIds,
		drawNumber: row.drawNumber ?? null,
		imageUrl: buildImageUrl(row.photoId, row.imageType) ?? null,
		sourceUrl: `${VTR_BASE_URL}/egyeni-valasztokeruletek/${row.maz}/${row.evk}?tab=jeloltek`,
		// Preserved fields (use existing if available, otherwise defaults)
		emails: existing?.emails ?? [],
		facebook: existing?.facebook ?? null,
		repealSupport: existing?.repealSupport ?? "unknown",
		summary: existing?.summary ?? null,
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

async function loadExistingCandidates(): Promise<Map<string, Candidate>> {
	try {
		const raw = JSON.parse(await Deno.readTextFile(OUTPUT_PATH));
		const arr = raw as Array<Record<string, unknown>>;
		return new Map(arr.map((c) => [c.slug as string, c as unknown as Candidate]));
	} catch {
		return new Map();
	}
}

async function main(): Promise<void> {
	const existingBySlug = await loadExistingCandidates();
	console.log(`Loaded ${existingBySlug.size} existing candidates`);

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
		.filter((row) => JOGEROS_STATUS_CODES.has(row.statusCode))
		.map((row) => toCandidate(row, statusByCode, constituencyByKey, existingBySlug))
		.sort(compareCandidates);

	const newSlugs = new Set(registeredCandidates.map((c) => c.slug));
	const removed = [...existingBySlug.keys()].filter((slug) => !newSlugs.has(slug));
	if (removed.length > 0) {
		console.log(`Removed ${removed.length} candidates no longer in NVI data:`);
		for (const slug of removed) {
			console.log(`  - ${slug}`);
		}
	}

	const added = registeredCandidates.filter((c) => !existingBySlug.has(c.slug));
	if (added.length > 0) {
		console.log(`Added ${added.length} new candidates:`);
		for (const c of added) {
			console.log(`  + ${c.slug}`);
		}
	}

	const output = `${JSON.stringify(registeredCandidates, null, "\t")}\n`;
	await Deno.writeTextFile(OUTPUT_PATH, output);

	console.log(`Saved ${registeredCandidates.length} candidates to ${OUTPUT_PATH.pathname}`);
	console.log(`Raw records: ${candidateResponse.list.length}, registered: ${registeredCandidates.length}`);
}

main();
