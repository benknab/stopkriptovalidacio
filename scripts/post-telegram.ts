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

	return `📅 ${date}
📌 ${title}
${summary ? `\n${summary}\n` : ""}
🔗 <a href="${url}">Részletek az idővonalon</a>`;
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

async function postSingleEvent(slug: string): Promise<void> {
	if (!events[slug]) {
		console.error(`Event not found: ${slug}`);
		printAvailableSlugs();
		Deno.exit(1);
	}

	const sentEvents = loadSentEvents();

	console.log(`Posting event: ${slug}`);
	const message = formatMessage(slug);
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

async function postAllUnsentEvents(): Promise<void> {
	const sentEvents = loadSentEvents();

	const unsentEvents = Object.entries(events)
		.filter(([slug]) => !sentEvents.has(slug))
		.sort(([, a], [, b]) => a.date.getTime() - b.date.getTime());

	if (unsentEvents.length === 0) {
		console.log("No new events to post");
		return;
	}

	console.log(`Posting ${unsentEvents.length} unsent event(s)...\n`);

	for (let i = 0; i < unsentEvents.length; i++) {
		const [slug] = unsentEvents[i];
		console.log(`[${i + 1}/${unsentEvents.length}] Posting: ${slug}`);

		const message = formatMessage(slug);
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

	console.log("Done!");
}

async function main(): Promise<void> {
	const slug = Deno.args[0];

	if (slug) {
		await postSingleEvent(slug);
	} else {
		await postAllUnsentEvents();
	}
}

if (import.meta.main) {
	main();
}
