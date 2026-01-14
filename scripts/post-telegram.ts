/**
 * Telegram Bot for posting timeline events
 *
 * Usage:
 *   deno task post-telegram                    # Post all unsent events
 *   deno task post-telegram <slug>             # Post specific event
 *   deno task post-telegram --dry-run          # Preview without posting
 *   deno task post-telegram <slug> --dry-run   # Preview specific event
 *
 * Telegram-only events:
 *   Events with type="telegram" are posted to Telegram but link to the
 *   main page instead of a specific timeline entry (no #hash).
 */

import "@std/dotenv/load";
import { SITE_URL, TELEGRAM_CHANNEL_URL } from "../constants/seo.ts";
import { events } from "../data/events.ts";
import sentEventsJson from "../data/sent-telegram-events.json" with { type: "json" };

const SENT_EVENTS_PATH = new URL("../data/sent-telegram-events.json", import.meta.url).pathname;
const TELEGRAM_API_URL = "https://api.telegram.org";

function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, "");
}

function formatDate(date: Date): string {
	return date.toLocaleDateString("hu-HU", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function buildEventUrl(slug: string): string {
	const event = events[slug];
	const url = new URL(SITE_URL);

	url.searchParams.set("utm_source", "telegram");
	url.searchParams.set("utm_medium", "social");
	url.searchParams.set("utm_campaign", "timeline_update");

	// Hidden events link to main page without hash
	if (event.type === "telegram") {
		return url.toString();
	}

	if (event.type === "secondary") {
		url.searchParams.set("masodlagos", "true");
	} else if (event.type === "tertiary") {
		url.searchParams.set("harmadlagos", "true");
	}

	url.hash = slug;
	return url.toString();
}

function formatMessage(slug: string): string {
	const event = events[slug];
	const title = event.title.hu;
	const date = formatDate(event.date);
	const summary = event.summary ? stripHtml(event.summary.hu) : "";
	const url = buildEventUrl(slug);
	const linkText = event.type === "telegram" ? "Tovább az oldalra" : "Részletek az idővonalon";

	return `📅 ${date}
📌 ${title}
${summary ? `\n${summary}\n` : ""}
🔗 <a href="${url}">${linkText}</a>`;
}

function loadSentEvents(): Set<string> {
	return new Set(sentEventsJson);
}

async function saveSentEvents(sentEvents: Set<string>): Promise<void> {
	const slugs = [...sentEvents].sort();
	await Deno.writeTextFile(SENT_EVENTS_PATH, JSON.stringify(slugs, null, "\t") + "\n");
}

async function postToTelegram(message: string): Promise<boolean> {
	const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
	if (!token) {
		console.error("Error: TELEGRAM_BOT_TOKEN environment variable not set");
		Deno.exit(1);
	}

	// Extract channel username from URL (e.g., "https://t.me/stopkriptovalidacio" -> "@stopkriptovalidacio")
	const channelMatch = TELEGRAM_CHANNEL_URL.match(/t\.me\/(.+)/);
	if (!channelMatch) {
		console.error("Error: Invalid TELEGRAM_CHANNEL_URL");
		Deno.exit(1);
	}
	const chatId = `@${channelMatch[1]}`;

	const response = await fetch(`${TELEGRAM_API_URL}/bot${token}/sendMessage`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			chat_id: chatId,
			text: message,
			parse_mode: "HTML",
			disable_web_page_preview: true,
		}),
	});

	const result = await response.json();

	if (!result.ok) {
		console.error("Telegram API error:", result.description);
		return false;
	}

	return true;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function printAvailableSlugs(): void {
	console.error("\nAvailable event slugs:");
	for (const key of Object.keys(events)) {
		console.error(`  ${key}`);
	}
}

async function postSingleEvent(slug: string, dryRun: boolean): Promise<void> {
	if (!events[slug]) {
		console.error(`Event not found: ${slug}`);
		printAvailableSlugs();
		Deno.exit(1);
	}

	const sentEvents = loadSentEvents();
	const prefix = dryRun ? "[DRY-RUN] " : "";

	console.log(`${prefix}Posting event: ${slug}`);
	const message = formatMessage(slug);

	if (dryRun) {
		console.log(`\n${message}\n`);
		console.log("✓ Dry-run complete (nothing sent)");
		return;
	}

	const success = await postToTelegram(message);

	if (success) {
		sentEvents.add(slug);
		await saveSentEvents(sentEvents);
		console.log("✓ Posted successfully");
	} else {
		console.error("✗ Failed to post");
		Deno.exit(1);
	}
}

async function postAllUnsentEvents(dryRun: boolean): Promise<void> {
	const sentEvents = loadSentEvents();
	const prefix = dryRun ? "[DRY-RUN] " : "";

	const unsentEvents = Object.entries(events)
		.filter(([slug]) => !sentEvents.has(slug))
		.sort(([, a], [, b]) => a.date.getTime() - b.date.getTime());

	if (unsentEvents.length === 0) {
		console.log(`${prefix}No new events to post`);
		return;
	}

	console.log(`${prefix}Posting ${unsentEvents.length} unsent event(s)...\n`);

	for (let i = 0; i < unsentEvents.length; i++) {
		const [slug] = unsentEvents[i];
		console.log(`${prefix}[${i + 1}/${unsentEvents.length}] Posting: ${slug}`);

		const message = formatMessage(slug);

		if (dryRun) {
			console.log(`\n${message}\n`);
			continue;
		}

		const success = await postToTelegram(message);

		if (success) {
			sentEvents.add(slug);
			await saveSentEvents(sentEvents);
			console.log("✓ Posted successfully\n");

			if (i < unsentEvents.length - 1) {
				await sleep(3000);
			}
		} else {
			console.error("✗ Failed to post, stopping\n");
			Deno.exit(1);
		}
	}

	console.log(`${prefix}Done!`);
}

async function main(): Promise<void> {
	const args = Deno.args.filter((arg) => !arg.startsWith("--"));
	const dryRun = Deno.args.includes("--dry-run");
	const slug = args[0];

	if (slug) {
		await postSingleEvent(slug, dryRun);
	} else {
		await postAllUnsentEvents(dryRun);
	}
}

if (import.meta.main) {
	main();
}
