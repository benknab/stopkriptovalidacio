/**
 * Pre-populates candidate-stances.json with contact data from mps.json
 * for incumbent MPs who are running again in 2026.
 *
 * Cross-references candidates by normalized name.
 * Only writes entries that don't already exist in candidate-stances.json.
 */

import candidatesJson from "../data/candidates.json" with { type: "json" };
import mpsJson from "../data/mps.json" with { type: "json" };
import candidateStancesJson from "../data/candidate-stances.json" with { type: "json" };

type MpEntry = {
	name: string;
	party: string;
	emails: string[];
	phones: string[];
	website?: string;
};

type CandidateStanceEntry = {
	slug: string;
	repealSupport: "for" | "against" | "unknown";
	summary: { hu: string; en: string };
	emails: string[];
	facebook: string;
};

function normalizeName(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/^dr\.\s*/i, "")
		.replace(/\s+/g, " ");
}

// Build MP lookup by normalized name
const mpLookup = new Map<string, { slug: string; mp: MpEntry }>();
for (const [slug, mp] of Object.entries(mpsJson as Record<string, MpEntry>)) {
	mpLookup.set(normalizeName(mp.name), { slug, mp });
}

const MAJOR_COALITIONS = new Set([
	"TISZA",
	"FIDESZ-KDNP",
	"Mi Hazánk",
	"DK",
	"MKKP",
	"Jobbik",
]);

const candidates = candidatesJson as Record<
	string,
	{ slug: string; name: string; coalition: string }
>;
const existingStances = candidateStancesJson as Record<string, CandidateStanceEntry>;

// Build new stances
const stances: Record<string, CandidateStanceEntry> = { ...existingStances };
let matchCount = 0;
let newCount = 0;

for (const [candSlug, candidate] of Object.entries(candidates)) {
	if (!MAJOR_COALITIONS.has(candidate.coalition)) continue;

	const normName = normalizeName(candidate.name);
	const mpMatch = mpLookup.get(normName);

	if (!mpMatch) continue;

	matchCount++;

	// Skip if already exists
	if (stances[candSlug]) {
		console.log(`  SKIP (exists): ${candidate.name} [${candSlug}]`);
		continue;
	}

	const { mp } = mpMatch;

	stances[candSlug] = {
		slug: candSlug,
		repealSupport: "unknown",
		summary: { hu: "", en: "" },
		emails: mp.emails ?? [],
		facebook: "",
	};

	newCount++;
	console.log(
		`  ADD: ${candidate.name} [${candSlug}] -> ${mp.emails.length} emails, ${mp.phones.length} phones`,
	);
}

// Sort keys alphabetically for stable output
const sorted: Record<string, CandidateStanceEntry> = {};
for (const key of Object.keys(stances).sort()) {
	sorted[key] = stances[key];
}

const outPath = new URL("../data/candidate-stances.json", import.meta.url);
await Deno.writeTextFile(outPath, JSON.stringify(sorted, null, "\t") + "\n");

console.log(`\nDone: ${matchCount} incumbents matched, ${newCount} new entries written.`);
console.log(`Total entries in candidate-stances.json: ${Object.keys(sorted).length}`);
