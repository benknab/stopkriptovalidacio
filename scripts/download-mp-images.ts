/**
 * Downloads MP profile pictures from parlament.hu and saves them locally.
 * Images are compressed during save using sharp.
 *
 * Usage:
 *   deno task download-images          # Download missing images only
 *   deno task download-images --force  # Re-download all images
 */

import sharp from "sharp";
import { mps, type MpSlug } from "../data/mps.ts";

const OUTPUT_DIR = new URL("../static/kepek", import.meta.url).pathname;
const DELAY_MS = 100;

async function ensureDir(path: string): Promise<void> {
	try {
		await Deno.mkdir(path, { recursive: true });
	} catch (error) {
		if (!(error instanceof Deno.errors.AlreadyExists)) {
			throw error;
		}
	}
}

async function fileExists(path: string): Promise<boolean> {
	try {
		await Deno.stat(path);
		return true;
	} catch {
		return false;
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadAndCompressImage(url: string, outputPath: string): Promise<void> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const arrayBuffer = await response.arrayBuffer();
	const buffer = new Uint8Array(arrayBuffer);

	// Compress using sharp - optimize JPEG with quality 85
	const compressed = await sharp(buffer)
		.jpeg({ quality: 85, mozjpeg: true })
		.toBuffer();

	await Deno.writeFile(outputPath, compressed);
}

async function main(): Promise<void> {
	const force = Deno.args.includes("--force");

	await ensureDir(OUTPUT_DIR);

	const entries = Object.entries(mps) as Array<[MpSlug, (typeof mps)[MpSlug]]>;
	const withImages = entries.filter(([_, mp]) => mp.imageUrl);

	console.log(`Found ${withImages.length} MPs with images`);
	if (force) {
		console.log("Force mode: re-downloading all images");
	}

	let downloaded = 0;
	let skipped = 0;
	let failed = 0;

	for (const [slug, mp] of withImages) {
		const outputPath = `${OUTPUT_DIR}/${slug}.jpg`;

		if (!force && await fileExists(outputPath)) {
			skipped++;
			continue;
		}

		try {
			console.log(`Downloading: ${slug}`);
			await downloadAndCompressImage(mp.imageUrl as string, outputPath);
			downloaded++;
			await sleep(DELAY_MS);
		} catch (error) {
			console.error(`Failed: ${slug} - ${error instanceof Error ? error.message : error}`);
			failed++;
		}
	}

	console.log("\n--- Summary ---");
	console.log(`Downloaded: ${downloaded}`);
	console.log(`Skipped (existing): ${skipped}`);
	console.log(`Failed: ${failed}`);
	console.log(`Total MPs with images: ${withImages.length}`);
}

main();
