import { events } from "../data/events.ts";
import { exchanges } from "../data/exchanges.ts";
import { mps } from "../data/mps.ts";
import { sources } from "../data/sources.ts";

function formatDateForJson(value: Date): string {
	return value.toISOString().split("T")[0];
}

function serializeForJson(value: unknown): unknown {
	if (value instanceof Date) {
		return formatDateForJson(value);
	}

	if (value instanceof Set) {
		return Array.from(value, (item) => serializeForJson(item));
	}

	if (Array.isArray(value)) {
		return value.map((item) => serializeForJson(item));
	}

	if (value !== null && typeof value === "object") {
		const serializedObject: Record<string, unknown> = {};
		for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
			serializedObject[key] = serializeForJson(nestedValue);
		}
		return serializedObject;
	}

	return value;
}

async function writeJson(relativePath: string, data: unknown): Promise<void> {
	const fileUrl = new URL(relativePath, import.meta.url);
	const content = `${JSON.stringify(serializeForJson(data), null, "\t")}\n`;
	await Deno.writeTextFile(fileUrl, content);
	console.log(`Wrote ${new URL(relativePath, import.meta.url).pathname}`);
}

async function main(): Promise<void> {
	await writeJson("../data/events.json", events);
	await writeJson("../data/exchanges.json", exchanges);
	await writeJson("../data/mps.json", mps);
	await writeJson("../data/sources.json", sources);
}

if (import.meta.main) {
	await main();
}
