/**
 * Inspects current parliamentary winners from the official NVI 2026 results app.
 *
 * Usage:
 *   deno task inspect-current-winners
 *   deno task inspect-current-winners --json
 *   deno task inspect-current-winners --output=data/nvi-current-winners-2026.json
 *   deno task inspect-current-winners --merge-mps-output=data/mps-merged-2026-preview.json
 *   deno task inspect-current-winners --final-only
 *   deno task inspect-current-winners --include-spokespeople
 *   deno task inspect-current-winners --election=ogy2026
 */

const DEFAULT_ELECTION = "ogy2026";
const BASE_URL = "https://vtr.valasztas.hu";
const CURRENT_MPS_PATH = new URL("../data/mps.json", import.meta.url).pathname;
const NATIONAL_LIST_LABEL = "Országos lista";
const MINORITY_LIST_LABEL = "Országos nemzetiségi lista";

type NviConfig = {
	ver: string;
	napkozi: string;
	szavossz: string;
};

type ListEnvelope<T> = {
	list: T[];
};

type DataEnvelope<T> = {
	data: T;
};

type PatkoMandate = {
	"jlcs_kod": number;
	"mand_tip": string;
	maz?: string;
	evk?: string;
	"ej_id"?: number;
	"tl_id"?: number;
	"tj_id"?: number;
};

type PatkoData = {
	mandatumok: PatkoMandate[];
};

type DistrictResultItem = {
	"ej_id": number;
	mandatum?: number;
};

type DistrictResult = {
	feldar: number;
	jogeros: string;
	"ujraszam_erintett": string;
	eredm: string;
	tetelek: DistrictResultItem[];
};

type DistrictResultRow = {
	maz: string;
	evk: string;
	"egyeni_jkv": DistrictResult;
};

type NationalListResultRow = {
	oszint: string;
	feldar: number;
	jogeros: string;
	eredm: string;
};

type Constituency = {
	maz: string;
	"maz_nev": string;
	evk: string;
	"evk_nev": string;
};

type DistrictCandidate = {
	"ej_id": number;
	"kpn_id": number;
	maz: string;
	evk: string;
	neve: string;
	"jlcs_nev": string;
};

type ListCandidate = {
	"tj_id": number;
	"kpn_id": number;
	sorsz: number;
	neve: string;
};

type CandidateList = {
	"tl_id": number;
	"jlcs_nev": string;
	"lista_tip": string;
	jeloltek?: ListCandidate[];
};

type Finality = "final" | "preliminary";
type MandateType = "district" | "list" | "spokesperson";

type WinnerRecord = {
	kpnId: string;
	name: string;
	party: string;
	mandateType: MandateType;
	districtLabel: string;
	finality: Finality;
	countedPercent: number;
	finalityCode: string;
	resultCode: string;
	jlcsKod: number;
	ejId?: number;
	tjId?: number;
	tlId?: number;
	constituencyCode?: string;
	constituencyName?: string;
	listType?: string;
	listRank?: number;
	isAffectedByRecount?: boolean;
};

type PartySummary = {
	party: string;
	total: number;
	district: number;
	list: number;
	spokesperson: number;
	final: number;
	preliminary: number;
};

type Summary = {
	returned: number;
	totalLoaded: number;
	mps: number;
	spokespeople: number;
	final: number;
	preliminary: number;
	districtFinal: number;
	districtPreliminary: number;
	listFinal: number;
	listPreliminary: number;
	spokespersonFinal: number;
	spokespersonPreliminary: number;
	parties: PartySummary[];
};

type Options = {
	election: string;
	json: boolean;
	finalOnly: boolean;
	includeSpokespeople: boolean;
	outputPath: string | null;
	mergeMpsOutputPath: string | null;
};

type CurrentVoteType = "yes" | "no" | "abstain" | "absent" | "not_voted" | "not_in_parliament" | "banned";
type CurrentParty =
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

type CurrentMandate = {
	type: "district";
	party: CurrentParty;
	district: string;
} | {
	type: "list";
	party: CurrentParty;
	list: string;
};

type RawMpRecord = {
	slug: string;
	name: string;
	vote: CurrentVoteType;
	elections: Record<string, CurrentMandate>;
	emails: string[];
	phones: string[];
	imageUrl?: string;
	website?: string;
	address?: string;
};

type RawMps = Record<string, RawMpRecord>;

type MergeSummary = {
	electionYear: number;
	matchedExisting: number;
	addedNew: number;
	reviewCount: number;
	totalRecords: number;
	outputPath: string;
};

type SourceUrls = {
	config: string;
	patko: string;
	districtResults: string;
	nationalListResults: string;
	constituencies: string;
	districtCandidates: string;
	listCandidates: string;
};

type InspectResult = {
	election: string;
	fetchedAt: string;
	dataVersions: NviConfig;
	filters: {
		finalOnly: boolean;
		includeSpokespeople: boolean;
	};
	sourceUrls: SourceUrls;
	summary: Summary;
	winners: WinnerRecord[];
};

type LoadedData = {
	config: NviConfig;
	sourceUrls: SourceUrls;
	patko: DataEnvelope<PatkoData>;
	districtResults: ListEnvelope<DistrictResultRow>;
	nationalListResults: ListEnvelope<NationalListResultRow>;
	constituencies: ListEnvelope<Constituency>;
	districtCandidates: ListEnvelope<DistrictCandidate>;
	listCandidates: ListEnvelope<CandidateList>;
};

type ListCandidateLookup = {
	candidate: ListCandidate;
	list: CandidateList;
};

function printUsage(): void {
	console.log(`Inspect current NVI parliamentary winners.

Usage:
	deno task inspect-current-winners [options]

Options:
	--json                   Print full JSON output
	--output=<path>          Write full JSON output to a file
	--merge-mps-output=<path> Merge winners into an MP JSON file and write result
	--final-only             Keep only fully final winners
	--include-spokespeople   Include nationality spokesperson rows
	--election=<slug>        Override election app slug (default: ${DEFAULT_ELECTION})
	--help                   Show this message`);
}

function parseOptions(args: string[]): Options {
	const options: Options = {
		election: DEFAULT_ELECTION,
		json: false,
		finalOnly: false,
		includeSpokespeople: false,
		outputPath: null,
		mergeMpsOutputPath: null,
	};

	for (const arg of args) {
		if (arg === "--json") {
			options.json = true;
			continue;
		}

		if (arg === "--final-only") {
			options.finalOnly = true;
			continue;
		}

		if (arg.startsWith("--output=")) {
			const outputPath = arg.slice("--output=".length);
			if (!outputPath) {
				throw new Error("--output requires a non-empty value.");
			}
			options.outputPath = outputPath;
			continue;
		}

		if (arg.startsWith("--merge-mps-output=")) {
			const mergeMpsOutputPath = arg.slice("--merge-mps-output=".length);
			if (!mergeMpsOutputPath) {
				throw new Error("--merge-mps-output requires a non-empty value.");
			}
			options.mergeMpsOutputPath = mergeMpsOutputPath;
			continue;
		}

		if (arg === "--include-spokespeople") {
			options.includeSpokespeople = true;
			continue;
		}

		if (arg === "--help") {
			printUsage();
			Deno.exit(0);
		}

		if (arg.startsWith("--election=")) {
			const election = arg.slice("--election=".length);
			if (!election) {
				throw new Error("--election requires a non-empty value.");
			}
			options.election = election;
			continue;
		}

		throw new Error(`Unknown argument: ${arg}`);
	}

	return options;
}

async function ensureParentDir(filePath: string): Promise<void> {
	const lastSlashIndex = filePath.lastIndexOf("/");
	const parentPath = lastSlashIndex === -1 ? "." : filePath.slice(0, lastSlashIndex);
	await Deno.mkdir(parentPath, { recursive: true });
}

async function writeOutput(filePath: string, data: unknown): Promise<void> {
	await ensureParentDir(filePath);
	await Deno.writeTextFile(
		filePath,
		`${JSON.stringify(data, null, "\t")}
`,
	);
}

async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: HTTP ${response.status} ${response.statusText}`);
	}

	return await response.json() as T;
}

function buildSourceUrls(election: string, config: NviConfig): SourceUrls {
	const prefix = `${BASE_URL}/${election}/data`;

	return {
		config: `${prefix}/config.json`,
		patko: `${prefix}/${config.szavossz}/szavossz/Patko.json`,
		districtResults: `${prefix}/${config.szavossz}/szavossz/OevkJkv.json`,
		nationalListResults: `${prefix}/${config.szavossz}/szavossz/ListasJkv.json`,
		constituencies: `${prefix}/${config.ver}/ver/OevkAdatok.json`,
		districtCandidates: `${prefix}/${config.ver}/ver/EgyeniJeloltek.json`,
		listCandidates: `${prefix}/${config.ver}/ver/ListakEsJeloltek.json`,
	};
}

async function loadData(election: string): Promise<LoadedData> {
	const configUrl = `${BASE_URL}/${election}/data/config.json`;
	const config = await fetchJson<NviConfig>(configUrl);
	const sourceUrls = buildSourceUrls(election, config);

	const [patko, districtResults, nationalListResults, constituencies, districtCandidates, listCandidates] =
		await Promise.all([
			fetchJson<DataEnvelope<PatkoData>>(sourceUrls.patko),
			fetchJson<ListEnvelope<DistrictResultRow>>(sourceUrls.districtResults),
			fetchJson<ListEnvelope<NationalListResultRow>>(sourceUrls.nationalListResults),
			fetchJson<ListEnvelope<Constituency>>(sourceUrls.constituencies),
			fetchJson<ListEnvelope<DistrictCandidate>>(sourceUrls.districtCandidates),
			fetchJson<ListEnvelope<CandidateList>>(sourceUrls.listCandidates),
		]);

	return {
		config,
		sourceUrls,
		patko,
		districtResults,
		nationalListResults,
		constituencies,
		districtCandidates,
		listCandidates,
	};
}

function getConstituencyKey(maz: string, evk: string): string {
	return `${maz}-${evk}`;
}

function getElectionYear(election: string): number {
	const match = election.match(/(\d{4})$/);
	if (!match) {
		throw new Error(`Could not derive election year from ${election}.`);
	}

	return Number.parseInt(match[1], 10);
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

function slugify(value: string): string {
	return normalizeNameForMatch(value).replace(/\s+/g, "-");
}

function formatWinnerName(value: string): string {
	return value.toLowerCase().split(/([ -])/).map((part) => {
		if (part === " " || part === "-") {
			return part;
		}

		return part.length === 0 ? part : `${part[0].toUpperCase()}${part.slice(1)}`;
	}).join("");
}

function mapWinnerParty(party: string): CurrentParty {
	if (party === "FIDESZ-KDNP") {
		return "Fidesz";
	}

	if (party === "TISZA" || party === "Mi Hazánk") {
		return party;
	}

	throw new Error(`Unhandled winner party: ${party}`);
}

function getMandateLabel(mandate: CurrentMandate): string {
	return mandate.type === "district" ? mandate.district : mandate.list;
}

function cloneMandate(mandate: CurrentMandate): CurrentMandate {
	return mandate.type === "district" ? { ...mandate } : { ...mandate };
}

function normalizeExistingMp(mp: RawMpRecord): RawMpRecord {
	const elections = Object.fromEntries(
		Object.entries(mp.elections).map(([year, mandate]) => [year, cloneMandate(mandate)]),
	) as Record<string, CurrentMandate>;

	return {
		...mp,
		elections,
		emails: [...mp.emails],
		phones: [...mp.phones],
	};
}

function createMandateFromWinner(winner: WinnerRecord): CurrentMandate {
	const party = mapWinnerParty(winner.party);

	if (winner.mandateType === "district") {
		return {
			type: "district",
			party,
			district: winner.districtLabel,
		};
	}

	return {
		type: "list",
		party,
		list: winner.districtLabel,
	};
}

function createNewMpFromWinner(winner: WinnerRecord, electionYear: number, slug: string): RawMpRecord {
	return {
		slug,
		name: formatWinnerName(winner.name),
		vote: "not_in_parliament",
		elections: {
			[String(electionYear)]: createMandateFromWinner(winner),
		},
		emails: [],
		phones: [],
	};
}

function buildUniqueWinnerSlug(winner: WinnerRecord, existingSlugs: Set<string>): string {
	const baseSlug = slugify(winner.name);
	const fallbackSuffix = winner.kpnId || String(winner.ejId ?? winner.tjId ?? winner.tlId ?? winner.jlcsKod);
	let slug = baseSlug || `winner-${fallbackSuffix}`;

	if (!existingSlugs.has(slug)) {
		return slug;
	}

	slug = `${slug}-${fallbackSuffix}`;
	if (!existingSlugs.has(slug)) {
		return slug;
	}

	let counter = 2;
	while (existingSlugs.has(`${slug}-${counter}`)) {
		counter++;
	}

	return `${slug}-${counter}`;
}

function orderMpRecord(mp: RawMpRecord): Record<string, unknown> {
	const orderedElections = Object.fromEntries(
		Object.entries(mp.elections)
			.sort(([left], [right]) => Number.parseInt(left, 10) - Number.parseInt(right, 10))
			.map(([year, mandate]) => [year, cloneMandate(mandate)]),
	);

	const ordered: Record<string, unknown> = {
		slug: mp.slug,
		name: mp.name,
		vote: mp.vote,
		elections: orderedElections,
		emails: [...mp.emails],
		phones: [...mp.phones],
	};

	if (mp.imageUrl !== undefined) {
		ordered.imageUrl = mp.imageUrl;
	}

	if (mp.website !== undefined) {
		ordered.website = mp.website;
	}

	if (mp.address !== undefined) {
		ordered.address = mp.address;
	}

	return ordered;
}

async function readMps(filePath: string): Promise<RawMps> {
	const content = await Deno.readTextFile(filePath);
	return JSON.parse(content) as RawMps;
}

function getLatestMandate(mp: RawMpRecord): CurrentMandate | null {
	const years = Object.keys(mp.elections)
		.map((year) => Number.parseInt(year, 10))
		.sort((left, right) => left - right);
	if (years.length === 0) {
		return null;
	}

	return mp.elections[String(years[years.length - 1])] ?? null;
}

function mergeWinnersIntoMps(winners: WinnerRecord[], mps: RawMps, electionYear: number, outputPath: string): {
	mergedMps: Record<string, unknown>;
	summary: MergeSummary;
} {
	const merged = Object.fromEntries(
		Object.entries(mps).map(([mpId, mp]) => [mpId, normalizeExistingMp(mp)]),
	) as RawMps;
	const existingSlugs = new Set(Object.values(merged).map((mp) => mp.slug));
	let matchedExisting = 0;
	let addedNew = 0;
	let reviewCount = 0;

	for (const winner of winners) {
		const nextMandate = createMandateFromWinner(winner);
		const existingMp = merged[winner.kpnId];
		if (existingMp) {
			const latestMandate = getLatestMandate(existingMp);
			if (
				latestMandate &&
				(latestMandate.party !== nextMandate.party ||
					getMandateLabel(latestMandate) !== getMandateLabel(nextMandate))
			) {
				reviewCount++;
			}

			merged[winner.kpnId] = {
				...existingMp,
				elections: {
					...existingMp.elections,
					[String(electionYear)]: nextMandate,
				},
			};
			matchedExisting++;
			continue;
		}

		const newSlug = buildUniqueWinnerSlug(winner, existingSlugs);
		existingSlugs.add(newSlug);
		merged[winner.kpnId] = createNewMpFromWinner(winner, electionYear, newSlug);
		addedNew++;
	}

	const orderedEntries = Object.entries(merged)
		.sort(([leftId], [rightId]) => Number.parseInt(leftId, 10) - Number.parseInt(rightId, 10))
		.map(([mpId, mp]) => [mpId, orderMpRecord(mp)]);

	return {
		mergedMps: Object.fromEntries(orderedEntries),
		summary: {
			electionYear,
			matchedExisting,
			addedNew,
			reviewCount,
			totalRecords: orderedEntries.length,
			outputPath,
		},
	};
}

function getFinality(jogeros: string): Finality {
	return jogeros === "I" ? "final" : "preliminary";
}

function buildPartySummaries(winners: WinnerRecord[]): PartySummary[] {
	const summaries = new Map<string, PartySummary>();

	for (const winner of winners) {
		const existing = summaries.get(winner.party) ?? {
			party: winner.party,
			total: 0,
			district: 0,
			list: 0,
			spokesperson: 0,
			final: 0,
			preliminary: 0,
		};

		existing.total++;
		existing[winner.mandateType]++;
		existing[winner.finality]++;
		summaries.set(winner.party, existing);
	}

	return Array.from(summaries.values()).sort((left, right) => {
		if (right.total !== left.total) {
			return right.total - left.total;
		}

		return left.party.localeCompare(right.party, "hu-HU");
	});
}

function buildSummary(winners: WinnerRecord[], totalLoaded: number): Summary {
	const mps = winners.filter((winner) => winner.mandateType !== "spokesperson");
	const spokespeople = winners.filter((winner) => winner.mandateType === "spokesperson");
	const district = winners.filter((winner) => winner.mandateType === "district");
	const list = winners.filter((winner) => winner.mandateType === "list");

	return {
		returned: winners.length,
		totalLoaded,
		mps: mps.length,
		spokespeople: spokespeople.length,
		final: winners.filter((winner) => winner.finality === "final").length,
		preliminary: winners.filter((winner) => winner.finality === "preliminary").length,
		districtFinal: district.filter((winner) => winner.finality === "final").length,
		districtPreliminary: district.filter((winner) => winner.finality === "preliminary").length,
		listFinal: list.filter((winner) => winner.finality === "final").length,
		listPreliminary: list.filter((winner) => winner.finality === "preliminary").length,
		spokespersonFinal: spokespeople.filter((winner) => winner.finality === "final").length,
		spokespersonPreliminary: spokespeople.filter((winner) => winner.finality === "preliminary").length,
		parties: buildPartySummaries(winners),
	};
}

function buildWinners(data: LoadedData, options: Options): WinnerRecord[] {
	const districtCandidatesById = new Map<number, DistrictCandidate>(
		data.districtCandidates.list.map((candidate) => [candidate["ej_id"], candidate]),
	);
	const districtResultsByKey = new Map<string, DistrictResultRow>(
		data.districtResults.list.map((row) => [getConstituencyKey(row.maz, row.evk), row]),
	);
	const constituenciesByKey = new Map<string, Constituency>(
		data.constituencies.list.map((constituency) => [
			getConstituencyKey(constituency.maz, constituency.evk),
			constituency,
		]),
	);
	const listCandidatesById = new Map<number, ListCandidateLookup>();

	for (const list of data.listCandidates.list) {
		for (const candidate of list.jeloltek ?? []) {
			listCandidatesById.set(candidate["tj_id"], { candidate, list });
		}
	}

	const nationalListResult = data.nationalListResults.list.find((row) => row.oszint === "5");
	if (!nationalListResult) {
		throw new Error("Missing national list results row (oszint=5).");
	}

	const winners: WinnerRecord[] = [];

	for (const mandate of data.patko.data.mandatumok) {
		if (mandate["mand_tip"] === "4" && !options.includeSpokespeople) {
			continue;
		}

		if (mandate["mand_tip"] === "1") {
			if (mandate["ej_id"] === undefined || mandate.maz === undefined || mandate.evk === undefined) {
				throw new Error("District mandate row is missing ej_id, maz, or evk.");
			}

			const candidate = districtCandidatesById.get(mandate["ej_id"]);
			if (!candidate) {
				throw new Error(`Missing district candidate for ej_id=${mandate["ej_id"]}.`);
			}

			const constituencyKey = getConstituencyKey(mandate.maz, mandate.evk);
			const districtResultRow = districtResultsByKey.get(constituencyKey);
			const constituency = constituenciesByKey.get(constituencyKey);

			if (!districtResultRow) {
				throw new Error(`Missing district result row for ${constituencyKey}.`);
			}

			if (!constituency) {
				throw new Error(`Missing constituency metadata for ${constituencyKey}.`);
			}

			winners.push({
				kpnId: String(candidate["kpn_id"]),
				name: candidate.neve,
				party: candidate["jlcs_nev"],
				mandateType: "district",
				districtLabel: formatDistrictLabel(constituency),
				finality: getFinality(districtResultRow["egyeni_jkv"].jogeros),
				countedPercent: districtResultRow["egyeni_jkv"].feldar,
				finalityCode: districtResultRow["egyeni_jkv"].jogeros,
				resultCode: districtResultRow["egyeni_jkv"].eredm,
				jlcsKod: mandate["jlcs_kod"],
				ejId: mandate["ej_id"],
				constituencyCode: `${mandate.maz}-${mandate.evk}`,
				constituencyName: constituency["evk_nev"],
				isAffectedByRecount: districtResultRow["egyeni_jkv"]["ujraszam_erintett"] === "I",
			});
			continue;
		}

		if (mandate["mand_tip"] === "2" || mandate["mand_tip"] === "4") {
			if (mandate["tj_id"] === undefined || mandate["tl_id"] === undefined) {
				throw new Error("List mandate row is missing tj_id or tl_id.");
			}

			const listCandidate = listCandidatesById.get(mandate["tj_id"]);
			if (!listCandidate) {
				throw new Error(`Missing list candidate for tj_id=${mandate["tj_id"]}.`);
			}

			winners.push({
				kpnId: String(listCandidate.candidate["kpn_id"]),
				name: listCandidate.candidate.neve,
				party: listCandidate.list["jlcs_nev"],
				mandateType: mandate["mand_tip"] === "2" ? "list" : "spokesperson",
				districtLabel: mandate["mand_tip"] === "2" ? NATIONAL_LIST_LABEL : MINORITY_LIST_LABEL,
				finality: getFinality(nationalListResult.jogeros),
				countedPercent: nationalListResult.feldar,
				finalityCode: nationalListResult.jogeros,
				resultCode: nationalListResult.eredm,
				jlcsKod: mandate["jlcs_kod"],
				tjId: mandate["tj_id"],
				tlId: mandate["tl_id"],
				listType: listCandidate.list["lista_tip"],
				listRank: listCandidate.candidate.sorsz,
			});
			continue;
		}

		throw new Error(`Unhandled mandate type: ${mandate["mand_tip"]}`);
	}

	return winners.sort((left, right) => {
		const mandateOrder: Record<MandateType, number> = {
			district: 0,
			list: 1,
			spokesperson: 2,
		};

		if (mandateOrder[left.mandateType] !== mandateOrder[right.mandateType]) {
			return mandateOrder[left.mandateType] - mandateOrder[right.mandateType];
		}

		if (left.party !== right.party) {
			return left.party.localeCompare(right.party, "hu-HU");
		}

		if (left.listRank !== undefined && right.listRank !== undefined && left.listRank !== right.listRank) {
			return left.listRank - right.listRank;
		}

		if (left.constituencyCode && right.constituencyCode && left.constituencyCode !== right.constituencyCode) {
			return left.constituencyCode.localeCompare(right.constituencyCode, "hu-HU");
		}

		return left.name.localeCompare(right.name, "hu-HU");
	});
}

function buildInspectResult(data: LoadedData, options: Options): InspectResult {
	const allWinners = buildWinners(data, options);
	const winners = options.finalOnly ? allWinners.filter((winner) => winner.finality === "final") : allWinners;

	return {
		election: options.election,
		fetchedAt: new Date().toISOString(),
		dataVersions: data.config,
		filters: {
			finalOnly: options.finalOnly,
			includeSpokespeople: options.includeSpokespeople,
		},
		sourceUrls: data.sourceUrls,
		summary: buildSummary(winners, allWinners.length),
		winners,
	};
}

function printHumanSummary(result: InspectResult): void {
	console.log(`Election: ${result.election}`);
	console.log(
		`Data versions: ver=${result.dataVersions.ver}, szavossz=${result.dataVersions.szavossz}, napkozi=${result.dataVersions.napkozi}`,
	);
	console.log(`Fetched at: ${result.fetchedAt}`);
	console.log("");
	console.log(`Returned rows: ${result.summary.returned} / ${result.summary.totalLoaded}`);
	console.log(`MPs: ${result.summary.mps}`);
	if (result.filters.includeSpokespeople) {
		console.log(`Spokespeople: ${result.summary.spokespeople}`);
	}
	console.log(`Final: ${result.summary.final}`);
	console.log(`Preliminary: ${result.summary.preliminary}`);
	console.log("");
	console.log(
		`District mandates: ${result.summary.districtFinal} final, ${result.summary.districtPreliminary} preliminary`,
	);
	console.log(`List mandates: ${result.summary.listFinal} final, ${result.summary.listPreliminary} preliminary`);
	if (result.filters.includeSpokespeople) {
		console.log(
			`Spokespeople: ${result.summary.spokespersonFinal} final, ${result.summary.spokespersonPreliminary} preliminary`,
		);
	}

	if (result.summary.parties.length > 0) {
		console.log("");
		console.log("By party:");
		for (const party of result.summary.parties) {
			const parts = [`${party.total} total`, `${party.district} district`, `${party.list} list`];
			if (result.filters.includeSpokespeople) {
				parts.push(`${party.spokesperson} spokesperson`);
			}
			parts.push(`${party.final} final`, `${party.preliminary} preliminary`);
			console.log(`- ${party.party}: ${parts.join(", ")}`);
		}
	}

	console.log("");
	console.log("Source URLs:");
	console.log(`- Patko: ${result.sourceUrls.patko}`);
	console.log(`- District results: ${result.sourceUrls.districtResults}`);
	console.log(`- National list results: ${result.sourceUrls.nationalListResults}`);

	if (result.summary.returned === 0) {
		console.log("");
		console.log("No rows matched the active filters.");
	}

	console.log("");
	console.log("Use --json to print the full joined winner rows.");
}

function printMergeSummary(summary: MergeSummary): void {
	console.log("");
	console.log("Merged MP data:");
	console.log(`- Election year added: ${summary.electionYear}`);
	console.log(`- Matched existing MPs: ${summary.matchedExisting}`);
	console.log(`- Added new winners: ${summary.addedNew}`);
	console.log(`- Review flags: ${summary.reviewCount}`);
	console.log(`- Total records written: ${summary.totalRecords}`);
	console.log(`- Output: ${summary.outputPath}`);
}

async function main(): Promise<void> {
	const options = parseOptions(Deno.args);
	const data = await loadData(options.election);
	const result = buildInspectResult(data, options);
	let mergeSummary: MergeSummary | null = null;

	if (options.outputPath) {
		await writeOutput(options.outputPath, result);
	}

	if (options.mergeMpsOutputPath) {
		const currentMps = await readMps(CURRENT_MPS_PATH);
		const electionYear = getElectionYear(options.election);
		const { mergedMps, summary } = mergeWinnersIntoMps(
			result.winners,
			currentMps,
			electionYear,
			options.mergeMpsOutputPath,
		);
		await writeOutput(options.mergeMpsOutputPath, mergedMps);
		mergeSummary = summary;
	}

	if (options.json) {
		console.log(JSON.stringify(result, null, "\t"));
		return;
	}

	printHumanSummary(result);

	if (options.outputPath) {
		console.log(`Wrote ${options.outputPath}`);
	}

	if (mergeSummary) {
		printMergeSummary(mergeSummary);
	}
}

if (import.meta.main) {
	await main();
}
