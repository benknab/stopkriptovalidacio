import { mps } from "../data/mps.ts";

const OUTPUT_PATH = new URL("../data/candidates.json", import.meta.url);

interface RawCandidate {
	slug: string;
	name: string;
	emails: string[];
	[key: string]: unknown;
}

function main(): void {
	// Build name → MP info lookup
	const mpByName = new Map<string, { slug: string; emails: Set<string> }>();
	for (const [slug, mp] of Object.entries(mps)) {
		const existing = mpByName.get(mp.name);
		if (existing) {
			console.warn(`WARNING: Duplicate MP name "${mp.name}" (${existing.slug} and ${slug})`);
		}
		mpByName.set(mp.name, { slug, emails: mp.emails });
	}

	// Load raw candidates JSON (not through Zod, to preserve structure for round-trip)
	const raw = Deno.readTextFileSync(OUTPUT_PATH);
	const candidates: RawCandidate[] = JSON.parse(raw);

	let matchCount = 0;
	let emailsAdded = 0;

	for (const candidate of candidates) {
		const mp = mpByName.get(candidate.name);
		if (!mp) continue;

		const existingEmails = new Set(candidate.emails);
		const merged = new Set([...existingEmails, ...mp.emails]);
		const newEmails = [...merged].sort();
		const added = newEmails.length - candidate.emails.length;

		candidate.emails = newEmails;
		matchCount++;
		emailsAdded += added;

		console.log(`  ${mp.slug} -> ${candidate.slug} (+${added} emails: ${newEmails.join(", ")})`);
	}

	// Write back
	Deno.writeTextFileSync(OUTPUT_PATH, `${JSON.stringify(candidates, null, "\t")}\n`);

	console.log(`\nDone: ${matchCount} incumbent candidates matched out of ${candidates.length} total`);
	console.log(`Emails added: ${emailsAdded}`);
}

main();
