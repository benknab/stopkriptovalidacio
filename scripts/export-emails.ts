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

// Print groups by vote type
console.log("=== EMAILS BY VOTE TYPE ===\n");

for (const [vote, emails] of Object.entries(voteGroups)) {
	console.log(`--- ${vote.toUpperCase()} (${emails.size} emails) ---`);
	console.log([...emails].join(", "));
	console.log();
}

// Print national list (Országos lista MPs only)
console.log("=== ORSZÁGOS LISTA (National List) ===");
console.log(`(${nationalListEmails.size} emails)\n`);
console.log([...nationalListEmails].join(", "));
