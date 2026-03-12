/**
 * Batch lookup script for candidate contact information.
 * Uses Exa API to search for email, phone, and Facebook for each candidate.
 *
 * Usage:
 *   EXA_API_KEY=... deno run --allow-read --allow-write --allow-net --allow-env scripts/lookup-candidates.ts
 *
 * Options (env vars):
 *   DRY_RUN=1        — search but don't write results
 *   LIMIT=10         — only process N candidates (for testing)
 *   COALITION=TISZA  — only process a specific coalition
 *   DELAY_MS=600     — delay between API calls (default 600ms)
 */

import candidatesJson from "../data/candidates.json" with { type: "json" };
import candidateStancesJson from "../data/candidate-stances.json" with {
	type: "json",
};

// ─── Config ──────────────────────────────────────────────────────────────────

const EXA_API_KEY = Deno.env.get("EXA_API_KEY");
if (!EXA_API_KEY) {
	console.error("ERROR: EXA_API_KEY environment variable is required");
	Deno.exit(1);
}

const DRY_RUN = Deno.env.get("DRY_RUN") === "1";
const limitStr = Deno.env.get("LIMIT");
const LIMIT = limitStr ? parseInt(limitStr) : 0;
const COALITION_FILTER = Deno.env.get("COALITION") ?? "";
const delayStr = Deno.env.get("DELAY_MS");
const DELAY_MS = delayStr ? parseInt(delayStr) : 600;

const MAJOR_COALITIONS = new Set([
	"TISZA",
	"FIDESZ-KDNP",
	"Mi Hazánk",
	"DK",
	"MKKP",
	"Jobbik",
]);

// ─── Types ───────────────────────────────────────────────────────────────────

type CandidateStanceEntry = {
	slug: string;
	repealSupport: "for" | "against" | "unknown";
	summary: { hu: string; en: string };
	emails: string[];
	phones: string[];
	facebook: string;
};

type CandidateEntry = {
	slug: string;
	name: string;
	displayName: string;
	coalition: string;
	county: string;
	district: string;
};

type ExaResult = {
	url: string;
	title: string;
	text?: string;
	highlights?: string[];
};

type ExaSearchResponse = {
	results: ExaResult[];
};

type LogEntry = {
	slug: string;
	name: string;
	coalition: string;
	searches: { query: string; resultCount: number }[];
	found: {
		emails: { value: string; source: string; confidence: string }[];
		phones: { value: string; source: string; confidence: string }[];
		facebook: { value: string; source: string; confidence: string }[];
	};
	timestamp: string;
};

// ─── Exa API ─────────────────────────────────────────────────────────────────

async function exaSearch(
	query: string,
	numResults = 5,
): Promise<ExaResult[]> {
	const resp = await fetch("https://api.exa.ai/search", {
		method: "POST",
		headers: {
			"x-api-key": EXA_API_KEY as string,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query,
			type: "auto",
			numResults,
			contents: {
				text: { maxCharacters: 3000 },
			},
		}),
	});

	if (!resp.ok) {
		const body = await resp.text();
		console.error(`  Exa API error (${resp.status}): ${body}`);
		return [];
	}

	const data = (await resp.json()) as ExaSearchResponse;
	return data.results ?? [];
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Extraction helpers ──────────────────────────────────────────────────────

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const PHONE_RE = /(?:\+36|0036|06)[\s\-./]?(?:1|20|30|31|50|70)[\s\-./]?\d{3}[\s\-./]?\d{3,4}/g;

const FACEBOOK_RE = /https?:\/\/(?:www\.)?facebook\.com\/[a-zA-Z0-9._\-]+\/?/g;

// Domains to ignore for email extraction
const EMAIL_BLACKLIST = new Set([
	"example.com",
	"sentry.io",
	"w3.org",
	"schema.org",
	"cloudflare.com",
	"googleusercontent.com",
	"gstatic.com",
	"googleapis.com",
	"google.com",
	"facebook.com",
	"twitter.com",
	"instagram.com",
	"wixpress.com",
	"wordpress.com",
]);

// Domains that are known to host political/candidate emails
const POLITICAL_DOMAINS = new Set([
	"parlament.hu",
	"fidesz.hu",
	"dkp.hu",
	"mihazank.hu",
	"jobbik.hu",
	"mkkp.party",
	"magyartisza.hu",
	"kdnp.hu",
	"momentum.hu",
	"mszp.hu",
	"gmail.com",
	"freemail.hu",
	"citromail.hu",
	"hotmail.com",
	"yahoo.com",
	"outlook.com",
	"outlook.hu",
	"gov.hu",
]);

function extractEmails(
	text: string,
	candidateName?: string,
): string[] {
	const matches = text.match(EMAIL_RE) ?? [];

	// Prepare candidate name parts for matching
	const nameParts = candidateName
		? removeAccents(candidateName.toLowerCase())
			.split(" ")
			.filter((p) => p.length > 2)
		: [];

	return [
		...new Set(
			matches
				.map((e) => e.toLowerCase())
				.filter((e) => {
					const domain = e.split("@")[1];
					if (EMAIL_BLACKLIST.has(domain)) return false;

					// Accept emails from known political domains
					if (POLITICAL_DOMAINS.has(domain)) return true;

					// Accept emails that contain parts of the candidate's name
					if (nameParts.length > 0) {
						const localPart = removeAccents(e.split("@")[0]);
						const emailFull = removeAccents(e);
						if (
							nameParts.some(
								(part) =>
									localPart.includes(part) ||
									emailFull.includes(part),
							)
						) {
							return true;
						}
					}

					// For .hu domains, only accept if email contains candidate name parts
					if (domain.endsWith(".hu") && nameParts.length > 0) {
						const localPart = removeAccents(e.split("@")[0]);
						return nameParts.some((part) => localPart.includes(part));
					}

					// Reject everything else (foreign domains, unrelated)
					return false;
				}),
		),
	];
}

function extractPhones(text: string): string[] {
	const matches = text.match(PHONE_RE) ?? [];
	return [
		...new Set(
			matches.map((p) => p.replace(/[\s\-./]/g, "")),
		),
	];
}

function extractFacebook(text: string, candidateName: string): string[] {
	const matches = text.match(FACEBOOK_RE) ?? [];
	// Filter out generic facebook.com links (homepage, login, etc.)
	const nameParts = candidateName
		.toLowerCase()
		.replace(/[áàä]/g, "a")
		.replace(/[éè]/g, "e")
		.replace(/[íì]/g, "i")
		.replace(/[óòöő]/g, "o")
		.replace(/[úùüű]/g, "u")
		.split(" ")
		.filter((p) => p.length > 2);

	return [
		...new Set(
			matches.filter((url) => {
				const path = url.toLowerCase().replace("https://", "").replace("http://", "").replace(
					"www.facebook.com/",
					"",
				);
				// Skip generic pages
				if (
					["login", "help", "policies", "privacy", "groups", "events", "watch", "marketplace", "gaming"].some(
						(g) => path.startsWith(g),
					)
				) {
					return false;
				}
				// Prefer pages that contain parts of the candidate's name
				return nameParts.some((part) => path.includes(part)) || path.length > 3;
			}),
		),
	];
}

// Remove accents from Hungarian text for search fallback
function removeAccents(text: string): string {
	return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ─── Candidate scoring (prioritize by party/role relevance) ──────────────────

function scoreCandidateResult(
	text: string,
	candidate: CandidateEntry,
): number {
	let score = 0;
	const lower = text.toLowerCase();
	const nameLower = candidate.name.toLowerCase();
	const nameNoAccent = removeAccents(nameLower);

	// Name match
	if (lower.includes(nameLower) || lower.includes(nameNoAccent)) score += 10;

	// Party match
	const coalitionLower = candidate.coalition.toLowerCase();
	if (lower.includes(coalitionLower)) score += 5;

	// County match
	if (lower.includes(candidate.county.toLowerCase())) score += 3;

	// Political context
	if (
		lower.includes("képviselő") || lower.includes("jelölt") ||
		lower.includes("választás") || lower.includes("parlament")
	) {
		score += 2;
	}

	return score;
}

// ─── Main lookup for one candidate ──────────────────────────────────────────

async function lookupCandidate(
	candidate: CandidateEntry,
): Promise<{ stance: CandidateStanceEntry; log: LogEntry }> {
	const log: LogEntry = {
		slug: candidate.slug,
		name: candidate.name,
		coalition: candidate.coalition,
		searches: [],
		found: { emails: [], phones: [], facebook: [] },
		timestamp: new Date().toISOString(),
	};

	const allEmails = new Set<string>();
	const allPhones = new Set<string>();
	const allFacebook = new Set<string>();

	// Build search queries
	const queries: string[] = [];

	// Query 1: Contact info search
	queries.push(
		`"${candidate.name}" ${candidate.coalition} elérhetőség OR email OR kapcsolat`,
	);

	// Query 2: Facebook search
	queries.push(
		`"${candidate.name}" ${candidate.coalition} facebook.com`,
	);

	// Query 3: If name has accents, also try without
	const nameNoAccent = removeAccents(candidate.name);
	if (nameNoAccent !== candidate.name) {
		queries.push(
			`"${nameNoAccent}" ${candidate.coalition} email OR elérhetőség`,
		);
	}

	for (const query of queries) {
		await delay(DELAY_MS);
		const results = await exaSearch(query, 5);
		log.searches.push({ query, resultCount: results.length });

		for (const result of results) {
			const combined = [result.title ?? "", result.text ?? "", result.url].join(
				" ",
			);
			const relevance = scoreCandidateResult(combined, candidate);

			// Only extract from relevant results
			if (relevance < 5) continue;

			const confidence = relevance >= 10 ? "high" : "medium";

			for (const email of extractEmails(combined, candidate.name)) {
				allEmails.add(email);
				log.found.emails.push({
					value: email,
					source: result.url,
					confidence,
				});
			}

			for (const phone of extractPhones(combined)) {
				allPhones.add(phone);
				log.found.phones.push({
					value: phone,
					source: result.url,
					confidence,
				});
			}

			for (const fb of extractFacebook(combined, candidate.name)) {
				allFacebook.add(fb);
				log.found.facebook.push({
					value: fb,
					source: result.url,
					confidence,
				});
			}
		}
	}

	const stance: CandidateStanceEntry = {
		slug: candidate.slug,
		repealSupport: "unknown",
		summary: { hu: "", en: "" },
		emails: [...allEmails],
		phones: [...allPhones],
		facebook: [...allFacebook][0] ?? "",
	};

	return { stance, log };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
	const candidates = candidatesJson as Record<string, CandidateEntry>;
	const existingStances = candidateStancesJson as Record<
		string,
		CandidateStanceEntry
	>;

	// Filter to candidates that need lookup
	let toProcess = Object.entries(candidates)
		.filter(([_, c]) => MAJOR_COALITIONS.has(c.coalition))
		.filter(([slug, _]) => !existingStances[slug])
		.map(([slug, c]) => ({ ...c, slug }));

	if (COALITION_FILTER) {
		toProcess = toProcess.filter((c) => c.coalition === COALITION_FILTER);
	}

	if (LIMIT > 0) {
		toProcess = toProcess.slice(0, LIMIT);
	}

	console.log(`Candidates to process: ${toProcess.length}`);
	console.log(`Already in stances: ${Object.keys(existingStances).length}`);
	console.log(`Dry run: ${DRY_RUN}`);
	console.log(`Delay: ${DELAY_MS}ms`);
	console.log("");

	// Load existing log if present
	const logPath = new URL("./lookup-candidates.log.json", import.meta.url);
	let logEntries: LogEntry[] = [];
	try {
		const existingLog = await Deno.readTextFile(logPath);
		logEntries = JSON.parse(existingLog);
	} catch {
		// No existing log
	}

	const stances: Record<string, CandidateStanceEntry> = { ...existingStances };
	let processed = 0;
	let withEmail = 0;
	let withPhone = 0;
	let withFacebook = 0;

	for (const candidate of toProcess) {
		processed++;
		const progress = `[${processed}/${toProcess.length}] ${candidate.name} (${candidate.coalition})`;
		console.log(progress);

		try {
			const { stance, log } = await lookupCandidate(candidate);
			logEntries.push(log);

			if (stance.emails.length > 0) withEmail++;
			if (stance.phones.length > 0) withPhone++;
			if (stance.facebook) withFacebook++;

			// Merge with existing (don't overwrite non-empty fields)
			const existing = stances[candidate.slug];
			if (existing) {
				// Merge emails/phones (union)
				const mergedEmails = [
					...new Set([...existing.emails, ...stance.emails]),
				];
				const mergedPhones = [
					...new Set([...existing.phones, ...stance.phones]),
				];
				existing.emails = mergedEmails;
				existing.phones = mergedPhones;
				if (!existing.facebook && stance.facebook) {
					existing.facebook = stance.facebook;
				}
			} else {
				stances[candidate.slug] = stance;
			}

			const emailStr = stance.emails.length > 0 ? stance.emails.join(", ") : "(none)";
			const phoneStr = stance.phones.length > 0 ? stance.phones.join(", ") : "(none)";
			const fbStr = stance.facebook || "(none)";
			console.log(`  -> emails: ${emailStr}`);
			console.log(`  -> phones: ${phoneStr}`);
			console.log(`  -> facebook: ${fbStr}`);

			// Write incrementally every 10 candidates
			if (!DRY_RUN && processed % 10 === 0) {
				await writeResults(stances, logEntries);
				console.log(`  [saved progress: ${Object.keys(stances).length} entries]`);
			}
		} catch (err) {
			console.error(`  ERROR: ${err}`);
		}
	}

	// Final write
	if (!DRY_RUN) {
		await writeResults(stances, logEntries);
	}

	console.log("\n=== Summary ===");
	console.log(`Processed: ${processed}`);
	console.log(`With email: ${withEmail} (${pct(withEmail, processed)})`);
	console.log(`With phone: ${withPhone} (${pct(withPhone, processed)})`);
	console.log(`With facebook: ${withFacebook} (${pct(withFacebook, processed)})`);
	console.log(
		`Total entries in candidate-stances.json: ${Object.keys(stances).length}`,
	);
}

async function writeResults(
	stances: Record<string, CandidateStanceEntry>,
	logEntries: LogEntry[],
): Promise<void> {
	// Sort keys for stable output
	const sorted: Record<string, CandidateStanceEntry> = {};
	for (const key of Object.keys(stances).sort()) {
		sorted[key] = stances[key];
	}

	const stancesPath = new URL(
		"../data/candidate-stances.json",
		import.meta.url,
	);
	await Deno.writeTextFile(
		stancesPath,
		JSON.stringify(sorted, null, "\t") + "\n",
	);

	const logPath = new URL("./lookup-candidates.log.json", import.meta.url);
	await Deno.writeTextFile(
		logPath,
		JSON.stringify(logEntries, null, "\t") + "\n",
	);
}

function pct(n: number, total: number): string {
	if (total === 0) return "0%";
	return `${Math.round((n / total) * 100)}%`;
}

main();
