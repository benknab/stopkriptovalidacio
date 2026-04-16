#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-run

/**
 * Temporary script to download MP candidate photos from valasztas.hu
 *
 * This script:
 * 1. Loads MP data from data/mps.json
 * 2. Fetches the ListakEsJeloltek.json from valasztas.hu
 * 3. Matches MPs by kpn_id to find their photos
 * 4. Downloads and optimizes images using sharp (via npm)
 *
 * Usage:
 *   deno run --allow-net --allow-read --allow-write --allow-run scripts/download-mp-images.ts
 */

// Configuration
const DATA_VERSION = "04112100";
const BASE_DATA_URL = `https://vtr.valasztas.hu/ogy2026/data/${DATA_VERSION}/ver`;
const BASE_IMAGE_URL = "https://vtr.valasztas.hu/ogy2026/kepek";
const OUTPUT_DIR = "./static/kepek";

// Types
interface ValasztasCandidate {
	"kpn_id": number;
	neve: string;
	fenykep?: number;
	"kep_tipus"?: string;
}

interface ValasztasList {
	"tl_id": number;
	"jlcs_nev": string;
	jeloltek: ValasztasCandidate[];
}

interface ValasztasData {
	list: ValasztasList[];
}

interface MpData {
	slug: string;
	name: string;
	vote: string;
	elections: Record<string, unknown>;
	emails: string[];
	phones: string[];
	imageUrl?: string;
	website?: string;
}

interface MpsJson {
	[key: string]: MpData;
}

// Build photo URL from fenykep ID
function getPhotoUrl(fenykep: number, kepTipus: string): string {
	const idStr = fenykep.toString();
	const lastDigit = idStr.slice(-1);
	const secondToLast = idStr.slice(-2, -1);
	const ext = kepTipus.toUpperCase();
	return `${BASE_IMAGE_URL}/${secondToLast}/${lastDigit}/Kep-${fenykep}.${ext}`;
}

// Fetch JSON data
async function fetchJson<T>(url: string): Promise<T> {
	console.log(`Fetching: ${url}`);
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status} for ${url}`);
	}
	return await response.json() as T;
}

// Download image and save to file
async function downloadImage(url: string, outputPath: string): Promise<boolean> {
	try {
		console.log(`  Downloading: ${url}`);
		const response = await fetch(url);
		if (!response.ok) {
			console.error(`  Failed to download: ${response.status}`);
			return false;
		}

		const data = new Uint8Array(await response.arrayBuffer());
		await Deno.writeFile(outputPath, data);
		console.log(`  Saved to: ${outputPath}`);
		return true;
	} catch (error) {
		console.error(`  Error downloading: ${error}`);
		return false;
	}
}

// Optimize image using sharp (requires npm sharp package)
async function optimizeImage(inputPath: string, outputPath: string): Promise<boolean> {
	try {
		// Check if sharp is available
		const command = new Deno.Command("npx", {
			args: [
				"sharp",
				inputPath,
				"--resize",
				"400",
				"--output",
				outputPath,
			],
			stdout: "piped",
			stderr: "piped",
		});

		const { success } = await command.output();
		if (success) {
			console.log(`  Optimized: ${outputPath}`);
			return true;
		}
		return false;
	} catch {
		// sharp not available, skip optimization
		return false;
	}
}

// Alternative: Use ImageMagick if available
async function optimizeWithImageMagick(inputPath: string, outputPath: string): Promise<boolean> {
	try {
		const command = new Deno.Command("convert", {
			args: [
				inputPath,
				"-resize",
				"400x400>",
				"-quality",
				"85",
				outputPath,
			],
			stdout: "piped",
			stderr: "piped",
		});

		const { success } = await command.output();
		if (success) {
			console.log(`  Optimized with ImageMagick: ${outputPath}`);
			return true;
		}
		return false;
	} catch {
		return false;
	}
}

// Ensure directory exists helper
async function ensureDir(dir: string): Promise<void> {
	try {
		await Deno.mkdir(dir, { recursive: true });
	} catch (error) {
		if (!(error instanceof Deno.errors.AlreadyExists)) {
			throw error;
		}
	}
}

// Main function
async function main(): Promise<void> {
	console.log("=== MP Image Download Script ===\n");

	// Ensure output directory exists
	await ensureDir(OUTPUT_DIR);

	// Load MPs data
	console.log("Loading MPs data...");
	const mpsData = await Deno.readTextFile("./data/mps.json");
	const mps: MpsJson = JSON.parse(mpsData);

	// Fetch valasztas.hu data
	console.log("Fetching valasztas.hu candidate data...");
	const valasztasData = await fetchJson<ValasztasData>(`${BASE_DATA_URL}/ListakEsJeloltek.json`);

	// Build a map of kpn_id to candidate data
	console.log("Building candidate map...");
	const candidateMap = new Map<number, ValasztasCandidate>();
	for (const list of valasztasData.list) {
		for (const candidate of list.jeloltek) {
			candidateMap.set(candidate.kpn_id, candidate);
		}
	}
	console.log(`Found ${candidateMap.size} candidates in valasztas.hu data\n`);

	// Track stats
	let matched = 0;
	let downloaded = 0;
	let skipped = 0;
	let failed = 0;

	// Track MPs that got new images for updating mps.json
	const updatedMpIds: string[] = [];

	// Process each MP
	for (const [mpId, mpData] of Object.entries(mps)) {
		const mpIdNum = parseInt(mpId, 10);
		const candidate = candidateMap.get(mpIdNum);

		if (!candidate) {
			console.log(`No match for MP: ${mpData.name} (ID: ${mpId})`);
			continue;
		}

		matched++;

		if (!candidate.fenykep || !candidate.kep_tipus) {
			console.log(`No photo available for: ${mpData.name}`);
			skipped++;
			continue;
		}

		// Check if already has valasztas.hu image or parlament.hu image
		const outputPath = `${OUTPUT_DIR}/${mpData.slug}.jpg`;

		try {
			await Deno.stat(outputPath);
			console.log(`Already exists: ${mpData.name} -> ${outputPath}`);
			skipped++;
			continue;
		} catch {
			// File doesn't exist, proceed with download
		}

		// Build photo URL
		const photoUrl = getPhotoUrl(candidate.fenykep, candidate.kep_tipus);
		console.log(`\nProcessing: ${mpData.name}`);
		console.log(`  Photo ID: ${candidate.fenykep}`);
		console.log(`  URL: ${photoUrl}`);

		// Download image
		const tempPath = `${outputPath}.temp`;
		const success = await downloadImage(photoUrl, tempPath);

		if (success) {
			// Try to optimize
			let optimized = false;

			// Try sharp first
			optimized = await optimizeImage(tempPath, outputPath);

			// Fall back to ImageMagick
			if (!optimized) {
				optimized = await optimizeWithImageMagick(tempPath, outputPath);
			}

			// If no optimization available, just rename
			if (!optimized) {
				await Deno.rename(tempPath, outputPath);
				console.log(`  Saved (no optimization): ${outputPath}`);
			} else {
				// Clean up temp file if optimization succeeded
				try {
					await Deno.remove(tempPath);
				} catch {
					// Ignore cleanup errors
				}
			}

			downloaded++;
			updatedMpIds.push(mpId);
		} else {
			failed++;
			// Clean up temp file on failure
			try {
				await Deno.remove(tempPath);
			} catch {
				// Ignore cleanup errors
			}
		}
	}

	// Update mps.json with new image URLs for downloaded images
	if (updatedMpIds.length > 0) {
		console.log(`\nUpdating mps.json for ${updatedMpIds.length} MPs...`);
		for (const mpId of updatedMpIds) {
			const mpData = mps[mpId];
			// Set local image URL - the MpImage component expects /kepek/{slug}.jpg
			mps[mpId] = { ...mpData, imageUrl: `/kepek/${mpData.slug}.jpg` };
		}

		// Write updated mps.json
		await Deno.writeTextFile("./data/mps.json", JSON.stringify(mps, null, "\t"));
		console.log("Updated mps.json with new image URLs");
	}

	// Print summary
	console.log("\n=== Summary ===");
	console.log(`Total MPs: ${Object.keys(mps).length}`);
	console.log(`Matched with valasztas.hu: ${matched}`);
	console.log(`Downloaded: ${downloaded}`);
	console.log(`Skipped (no photo/existing): ${skipped}`);
	console.log(`Failed: ${failed}`);

	// Close browser if we opened one
	try {
		const closeCmd = new Deno.Command("npx", {
			args: ["agent-browser", "close"],
			stdout: "piped",
			stderr: "piped",
		});
		await closeCmd.output();
	} catch {
		// Ignore
	}
}

// Run main function
if (import.meta.main) {
	main().catch((error) => {
		console.error("Script failed:", error);
		Deno.exit(1);
	});
}
