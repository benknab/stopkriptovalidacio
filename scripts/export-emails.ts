import { mps, type VoteType } from "../data/mps.ts";

// Group MPs by vote type
const voteGroups: Record<VoteType, Set<string>> = {
	yes: new Set(),
	no: new Set(),
	abstain: new Set(),
	absent: new Set(),
	"not_voted": new Set(),
	banned: new Set(),
};

// Collect emails from MPs on the national list (Országos lista)
const nationalListEmails = new Set<string>();

for (const mp of Object.values(mps)) {
	for (const email of mp.emails) {
		voteGroups[mp.vote].add(email);
		if (mp.district === "Országos lista") {
			nationalListEmails.add(email);
		}
	}
}

// Helper to chunk array into groups of n
function chunk<T>(arr: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size));
	}
	return chunks;
}

const BATCH_SIZE = 20;

// Print groups by vote type
console.log("=== EMAILS BY VOTE TYPE ===\n");

for (const [vote, emails] of Object.entries(voteGroups)) {
	const emailList = [...emails];
	const batches = chunk(emailList, BATCH_SIZE);
	console.log(`--- ${vote.toUpperCase()} (${emails.size} emails, ${batches.length} batch(es)) ---`);
	for (let i = 0; i < batches.length; i++) {
		console.log(`\nBatch ${i + 1}/${batches.length}:`);
		console.log(batches[i].join(", "));
	}
	console.log();
}

// Print national list (Országos lista MPs only)
console.log("=== ORSZÁGOS LISTA (National List) ===");
const nationalBatches = chunk([...nationalListEmails], BATCH_SIZE);
console.log(`(${nationalListEmails.size} emails, ${nationalBatches.length} batch(es))\n`);
for (let i = 0; i < nationalBatches.length; i++) {
	console.log(`Batch ${i + 1}/${nationalBatches.length}:`);
	console.log(nationalBatches[i].join(", "));
	console.log();
}
