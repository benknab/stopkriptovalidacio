import { mps, type VoteType } from "../data/mps.ts";

// Group MPs by vote type
const voteGroups: Record<VoteType, Set<string>> = {
	yes: new Set(),
	no: new Set(),
	abstain: new Set(),
	absent: new Set(),
	not_voted: new Set(),
	banned: new Set(),
};

// Collect all emails
const allEmails = new Set<string>();

for (const mp of Object.values(mps)) {
	for (const email of mp.emails) {
		voteGroups[mp.vote].add(email);
		allEmails.add(email);
	}
}

// Print groups by vote type
console.log("=== EMAILS BY VOTE TYPE ===\n");

for (const [vote, emails] of Object.entries(voteGroups)) {
	console.log(`--- ${vote.toUpperCase()} (${emails.size} emails) ---`);
	console.log([...emails].join(", "));
	console.log();
}

// Print full national list
console.log("=== FULL NATIONAL LIST ===");
console.log(`(${allEmails.size} total emails)\n`);
console.log([...allEmails].join(", "));
