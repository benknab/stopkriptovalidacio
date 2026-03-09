import { events } from "../data/events.ts";
import eventsJson from "../data/events.json" with { type: "json" };
import { exchanges } from "../data/exchanges.ts";
import exchangesJson from "../data/exchanges.json" with { type: "json" };
import { mps } from "../data/mps.ts";
import mpsJson from "../data/mps.json" with { type: "json" };
import { sources } from "../data/sources.ts";
import sourcesJson from "../data/sources.json" with { type: "json" };

function formatDateForJson(value: Date): string {
	return value.toISOString().split("T")[0];
}

function normalizeForComparison(value: unknown): unknown {
	if (value instanceof Date) {
		return formatDateForJson(value);
	}

	if (value instanceof Set) {
		return Array.from(value, (item) => normalizeForComparison(item));
	}

	if (Array.isArray(value)) {
		return value.map((item) => normalizeForComparison(item));
	}

	if (value !== null && typeof value === "object") {
		const normalizedObject: Record<string, unknown> = {};
		for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
			normalizedObject[key] = normalizeForComparison(nestedValue);
		}
		return normalizedObject;
	}

	return value;
}

function canonicalize(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map((item) => canonicalize(item));
	}

	if (value !== null && typeof value === "object") {
		const canonicalObject: Record<string, unknown> = {};
		const keys = Object.keys(value as Record<string, unknown>).sort();
		for (const key of keys) {
			canonicalObject[key] = canonicalize((value as Record<string, unknown>)[key]);
		}
		return canonicalObject;
	}

	return value;
}

function isEqual(left: unknown, right: unknown): boolean {
	const canonicalLeft = JSON.stringify(canonicalize(normalizeForComparison(left)));
	const canonicalRight = JSON.stringify(canonicalize(normalizeForComparison(right)));
	return canonicalLeft === canonicalRight;
}

function assertEqual(name: string, left: unknown, right: unknown): void {
	if (!isEqual(left, right)) {
		throw new Error(`Mismatch for ${name}`);
	}
	console.log(`OK: ${name}`);
}

function main(): void {
	assertEqual("events", events, eventsJson);
	assertEqual("exchanges", exchanges, exchangesJson);
	assertEqual("mps", mps, mpsJson);
	assertEqual("sources", sources, sourcesJson);
	console.log("All data files match JSON source-of-truth.");
}

if (import.meta.main) {
	main();
}
