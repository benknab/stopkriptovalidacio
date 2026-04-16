const BASE_URL_2022 = "https://vtr.valasztas.hu/ogy2022/data";
const BASE_URL_2026 = "https://vtr.valasztas.hu/ogy2026/data";
const DEFAULT_INPUT_PATH = new URL("../data/mps.json", import.meta.url).pathname;
const DEFAULT_OUTPUT_PATH = new URL("../data/mps.json", import.meta.url).pathname;
const NATIONAL_LIST = "Országos lista";
const MINORITY_LIST = "Országos nemzetiségi lista";
const MANUAL_KPN_ID_BY_SLUG: Record<string, string> = {
	"greczy-zsolt": "3661720",
	"z-karpat-daniel": "8308368",
};

type VoteType = "yes" | "no" | "abstain" | "absent" | "not_voted" | "not_in_parliament" | "banned";
type Party =
	| "Fidesz"
	| "KDNP"
	| "DK"
	| "Momentum"
	| "MSZP"
	| "Jobbik"
	| "Mi Hazánk"
	| "TISZA"
	| "Párbeszéd"
	| "független"
	| "nemzetiségi";

type OldMpRecord = {
	name: string;
	party: Party;
	vote: VoteType;
	emails: string[];
	phones: string[];
	imageUrl?: string;
	district?: string;
	website?: string;
	address?: string;
};

type OldMps = Record<string, OldMpRecord>;

type DistrictMandate = {
	type: "district";
	party: Party;
	district: string;
};

type ListMandate = {
	type: "list";
	party: Party;
	list: string;
};

type Mandate = DistrictMandate | ListMandate;

type NewMpRecord = {
	slug: string;
	name: string;
	vote: VoteType;
	elections: Record<string, Mandate>;
	emails: string[];
	phones: string[];
	imageUrl?: string;
	website?: string;
	address?: string;
};

type NewMps = Record<string, NewMpRecord>;

type NviConfig = {
	ver: string;
};

type ListEnvelope<T> = {
	list: T[];
};

type DistrictCandidate = {
	"ej_id": number;
	"kpn_id": number;
	"dr_jelzo"?: string;
	neve: string;
	maz: string;
	evk: string;
};

type ListCandidate = {
	"tj_id": number;
	"kpn_id": number;
	"dr_jelzo"?: string;
	neve: string;
};

type CandidateList = {
	"tl_id": number;
	"lista_tip": string;
	jeloltek?: ListCandidate[];
};

type Constituency = {
	maz: string;
	"maz_nev": string;
	evk: string;
	"evk_nev": string;
};

type Winner2022 = {
	kpnId: string;
	name: string;
	label: string;
};

type CandidateIdLookup = {
	kpnId: string;
	name: string;
};

type Options = {
	inputPath: string;
	outputPath: string;
};

function parseOptions(args: string[]): Options {
	const options: Options = {
		inputPath: DEFAULT_INPUT_PATH,
		outputPath: DEFAULT_OUTPUT_PATH,
	};

	for (const arg of args) {
		if (arg.startsWith("--input=")) {
			options.inputPath = arg.slice("--input=".length);
			continue;
		}

		if (arg.startsWith("--output=")) {
			options.outputPath = arg.slice("--output=".length);
			continue;
		}

		if (arg === "--help") {
			console.log(
				`Usage: deno run --allow-read --allow-write --allow-net scripts/backfill-mps-kpn-ids.ts [--input=path] [--output=path]`,
			);
			Deno.exit(0);
		}

		throw new Error(`Unknown argument: ${arg}`);
	}

	return options;
}

async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: HTTP ${response.status} ${response.statusText}`);
	}

	return await response.json() as T;
}

async function readJson<T>(filePath: string): Promise<T> {
	return JSON.parse(await Deno.readTextFile(filePath)) as T;
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
	const lastSlashIndex = filePath.lastIndexOf("/");
	const parentPath = lastSlashIndex === -1 ? "." : filePath.slice(0, lastSlashIndex);
	await Deno.mkdir(parentPath, { recursive: true });
	await Deno.writeTextFile(filePath, `${JSON.stringify(data, null, "\t")}\n`);
}

function formatDistrictLabel(constituency: Constituency): string {
	const countyName = constituency["maz_nev"]
		.replace(/ vármegye$/u, "")
		.replace(/ megye$/u, "")
		.replace(/ főváros$/u, "");
	return `${countyName} ${Number.parseInt(constituency.evk, 10)}. OEVK`;
}

function normalizeNameForMatch(value: string): string {
	const normalized = value.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.replace(/[^a-z0-9\s.-]/g, " ")
		.replace(/[.]/g, " ")
		.trim();
	const tokens = normalized.split(/\s+/).filter(Boolean).filter((token) => {
		return token !== "dr" && token !== "ifj" && token !== "id" && token !== "ozv";
	});
	return tokens.join(" ");
}

function normalizeLabelForMatch(value: string): string {
	return value.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.replace(/[^a-z0-9\s.-]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function slugify(value: string): string {
	return normalizeNameForMatch(value).replace(/\s+/g, "-");
}

function buildNameMatchKeys(name: string): string[] {
	const normalized = normalizeNameForMatch(name);
	const tokens = normalized.split(" ").filter(Boolean);
	const keys: string[] = [];

	if (normalized) {
		keys.push(`name:${normalized}`);
	}

	if (tokens.length >= 2) {
		keys.push(`prefix2:${tokens.slice(0, 2).join(" ")}`);
		keys.push(`suffix2:${tokens.slice(-2).join(" ")}`);
	}

	if (tokens.length >= 3) {
		keys.push(`prefix3:${tokens.slice(0, 3).join(" ")}`);
		keys.push(`suffix3:${tokens.slice(-3).join(" ")}`);
	}

	const slug = slugify(name);
	if (slug) {
		keys.push(`slug:${slug}`);
	}

	return keys;
}

function buildWinnerName(drTitle: string | undefined, name: string): string {
	return drTitle ? `${drTitle} ${name}` : name;
}

function getConstituencyKey(maz: string, evk: string): string {
	return `${maz}-${evk}`;
}

function getMandateFromCurrentMp(mp: OldMpRecord): Mandate {
	if (!mp.district) {
		throw new Error(`Missing district/list label for ${mp.name}.`);
	}

	if (mp.district === NATIONAL_LIST || mp.district === MINORITY_LIST) {
		return {
			type: "list",
			party: mp.party,
			list: mp.district,
		};
	}

	return {
		type: "district",
		party: mp.party,
		district: mp.district,
	};
}

function addLookupEntry(index: Map<string, Winner2022[]>, key: string, winner: Winner2022): void {
	const existing = index.get(key) ?? [];
	if (!existing.some((entry) => entry.kpnId === winner.kpnId)) {
		existing.push(winner);
	}
	index.set(key, existing);
}

function addCandidateIdLookupEntry(
	index: Map<string, CandidateIdLookup[]>,
	key: string,
	candidate: CandidateIdLookup,
): void {
	const existing = index.get(key) ?? [];
	if (!existing.some((entry) => entry.kpnId === candidate.kpnId)) {
		existing.push(candidate);
	}
	index.set(key, existing);
}

function buildCandidatesByName(
	districtCandidates: ListEnvelope<DistrictCandidate>,
	listCandidates: ListEnvelope<CandidateList>,
	constituencies: ListEnvelope<Constituency>,
): Map<string, Winner2022[]> {
	const constituenciesByKey = new Map(
		constituencies.list.map((
			constituency,
		) => [getConstituencyKey(constituency.maz, constituency.evk), constituency]),
	);

	const winnersByName = new Map<string, Winner2022[]>();

	for (const candidate of districtCandidates.list) {
		const constituency = constituenciesByKey.get(getConstituencyKey(candidate.maz, candidate.evk));
		if (!constituency) {
			throw new Error(`Missing constituency metadata for ${candidate.maz}-${candidate.evk}.`);
		}

		const winner = {
			kpnId: String(candidate["kpn_id"]),
			name: buildWinnerName(candidate["dr_jelzo"], candidate.neve),
			label: formatDistrictLabel(constituency),
		};

		for (const key of buildNameMatchKeys(winner.name)) {
			addLookupEntry(winnersByName, key, winner);
		}
	}

	for (const list of listCandidates.list) {
		const label = list["lista_tip"] === "N" ? MINORITY_LIST : NATIONAL_LIST;
		for (const candidate of list.jeloltek ?? []) {
			const winner = {
				kpnId: String(candidate["kpn_id"]),
				name: buildWinnerName(candidate["dr_jelzo"], candidate.neve),
				label,
			};

			for (const key of buildNameMatchKeys(winner.name)) {
				addLookupEntry(winnersByName, key, winner);
			}
		}
	}

	return winnersByName;
}

function resolveWinnerForMp(
	slug: string,
	mp: OldMpRecord,
	winnersByName: Map<string, Winner2022[]>,
	fallbackCandidateIds: Map<string, CandidateIdLookup[]>,
): Winner2022 {
	const currentMandate = getMandateFromCurrentMp(mp);
	const currentLabel = currentMandate.type === "district" ? currentMandate.district : currentMandate.list;

	if (MANUAL_KPN_ID_BY_SLUG[slug]) {
		return {
			kpnId: MANUAL_KPN_ID_BY_SLUG[slug],
			name: mp.name,
			label: currentLabel,
		};
	}

	const nameMatchKeys = buildNameMatchKeys(mp.name);
	const winners = Array.from(new Map(
		nameMatchKeys
			.flatMap((key) => winnersByName.get(key) ?? [])
			.map((winner) => [winner.kpnId, winner]),
	).values());
	const normalizedCurrentLabel = normalizeLabelForMatch(currentLabel);
	const matchingLabel = winners.filter((winner) => normalizeLabelForMatch(winner.label) === normalizedCurrentLabel);

	if (matchingLabel.length === 1) {
		return matchingLabel[0];
	}

	if (winners.length === 1) {
		return winners[0];
	}

	const matchingSlug = winners.filter((winner) => slugify(winner.name) === slug);
	if (matchingSlug.length === 1) {
		return matchingSlug[0];
	}

	if (matchingLabel.length > 1 || matchingSlug.length > 1) {
		throw new Error(`Ambiguous NVI match for ${slug} (${mp.name}).`);
	}

	const fallbackMatches = Array.from(new Map(
		nameMatchKeys
			.flatMap((key) => fallbackCandidateIds.get(key) ?? [])
			.map((candidate) => [candidate.kpnId, candidate]),
	).values());

	if (fallbackMatches.length === 1) {
		console.log(`Fallback 2026 kpn_id for ${slug} (${mp.name}) -> ${fallbackMatches[0].kpnId}`);
		return {
			kpnId: fallbackMatches[0].kpnId,
			name: fallbackMatches[0].name,
			label: currentLabel,
		};
	}

	throw new Error(`Could not match ${slug} (${mp.name}) to a 2022 NVI winner.`);
}

function toNewMpRecord(slug: string, mp: OldMpRecord): NewMpRecord {
	const mandate = getMandateFromCurrentMp(mp);
	return {
		slug,
		name: mp.name,
		vote: mp.vote,
		elections: {
			"2022": mandate,
		},
		emails: [...mp.emails],
		phones: [...mp.phones],
		...(mp.imageUrl ? { imageUrl: mp.imageUrl } : {}),
		...(mp.website ? { website: mp.website } : {}),
		...(mp.address ? { address: mp.address } : {}),
	};
}

function orderRecord(record: NewMpRecord): Record<string, unknown> {
	return {
		slug: record.slug,
		name: record.name,
		vote: record.vote,
		elections: record.elections,
		emails: record.emails,
		phones: record.phones,
		...(record.imageUrl ? { imageUrl: record.imageUrl } : {}),
		...(record.website ? { website: record.website } : {}),
		...(record.address ? { address: record.address } : {}),
	};
}

async function loadWinnerData(): Promise<Map<string, Winner2022[]>> {
	const config = await fetchJson<NviConfig>(`${BASE_URL_2022}/config.json`);
	const [districtCandidates, listCandidates, constituencies] = await Promise.all([
		fetchJson<ListEnvelope<DistrictCandidate>>(`${BASE_URL_2022}/${config.ver}/ver/EgyeniJeloltek.json`),
		fetchJson<ListEnvelope<CandidateList>>(`${BASE_URL_2022}/${config.ver}/ver/ListakEsJeloltek.json`),
		fetchJson<ListEnvelope<Constituency>>(`${BASE_URL_2022}/${config.ver}/ver/OevkAdatok.json`),
	]);

	return buildCandidatesByName(districtCandidates, listCandidates, constituencies);
}

async function loadFallbackCandidateIds(): Promise<Map<string, CandidateIdLookup[]>> {
	const config = await fetchJson<NviConfig>(`${BASE_URL_2026}/config.json`);
	const [districtCandidates, listCandidates] = await Promise.all([
		fetchJson<ListEnvelope<DistrictCandidate>>(`${BASE_URL_2026}/${config.ver}/ver/EgyeniJeloltek.json`),
		fetchJson<ListEnvelope<CandidateList>>(`${BASE_URL_2026}/${config.ver}/ver/ListakEsJeloltek.json`),
	]);

	const lookup = new Map<string, CandidateIdLookup[]>();

	for (const candidate of districtCandidates.list) {
		const entry = {
			kpnId: String(candidate["kpn_id"]),
			name: buildWinnerName(candidate["dr_jelzo"], candidate.neve),
		};
		for (const key of buildNameMatchKeys(entry.name)) {
			addCandidateIdLookupEntry(lookup, key, entry);
		}
	}

	for (const list of listCandidates.list) {
		for (const candidate of list.jeloltek ?? []) {
			const entry = {
				kpnId: String(candidate["kpn_id"]),
				name: buildWinnerName(candidate["dr_jelzo"], candidate.neve),
			};
			for (const key of buildNameMatchKeys(entry.name)) {
				addCandidateIdLookupEntry(lookup, key, entry);
			}
		}
	}

	return lookup;
}

async function main(): Promise<void> {
	const options = parseOptions(Deno.args);
	const rawInput = await readJson<Record<string, unknown>>(options.inputPath);
	const firstRecord = Object.values(rawInput)[0] as Record<string, unknown> | undefined;
	if (firstRecord && typeof firstRecord === "object" && "slug" in firstRecord && "elections" in firstRecord) {
		console.log(`${options.inputPath} already uses kpn_id keys and elections data.`);
		return;
	}

	const oldMps = rawInput as OldMps;
	const winnersByName = await loadWinnerData();
	const fallbackCandidateIds = await loadFallbackCandidateIds();
	const newMps: NewMps = {};
	const unresolved: string[] = [];

	for (const [slug, mp] of Object.entries(oldMps)) {
		let winner: Winner2022;
		try {
			winner = resolveWinnerForMp(slug, mp, winnersByName, fallbackCandidateIds);
		} catch (error) {
			unresolved.push(`${slug}: ${error instanceof Error ? error.message : String(error)}`);
			continue;
		}

		if (newMps[winner.kpnId]) {
			throw new Error(`Duplicate kpnId ${winner.kpnId} for ${slug}.`);
		}

		newMps[winner.kpnId] = toNewMpRecord(slug, mp);
	}

	const ordered = Object.fromEntries(
		Object.entries(newMps)
			.sort(([left], [right]) => Number.parseInt(left, 10) - Number.parseInt(right, 10))
			.map(([kpnId, record]) => [kpnId, orderRecord(record)]),
	);

	if (unresolved.length > 0) {
		console.error("Unresolved MPs:");
		for (const item of unresolved) {
			console.error(`- ${item}`);
		}
		throw new Error(`Could not resolve ${unresolved.length} MPs.`);
	}

	await writeJson(options.outputPath, ordered);

	console.log(`Matched ${Object.keys(ordered).length} MPs to 2022 NVI kpn_id values.`);
	console.log(`Wrote ${options.outputPath}`);
}

if (import.meta.main) {
	await main();
}
