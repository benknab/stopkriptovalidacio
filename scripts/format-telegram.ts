import { SITE_URL } from "../constants/seo.ts";
import { events } from "../data/events.ts";

const slug = Deno.args[0];

if (!slug) {
	console.error("Usage: deno task notify <event-slug>");
	console.error("\nAvailable event slugs:");
	for (const key of Object.keys(events)) {
		console.error(`  ${key}`);
	}
	Deno.exit(1);
}

const event = events[slug];

if (!event) {
	console.error(`Event not found: ${slug}`);
	console.error("\nAvailable event slugs:");
	for (const key of Object.keys(events)) {
		console.error(`  ${key}`);
	}
	Deno.exit(1);
}

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

const title = event.title.hu;
const date = formatDate(event.date);
const summary = event.summary ? stripHtml(event.summary.hu) : "";
const url = `${SITE_URL}/?utm_source=telegram&utm_medium=social&utm_campaign=timeline_update#${slug}`;

const message = `📢 Új esemény a Kripto Validáció idővonalán

📅 ${date}
📌 ${title}
${summary ? `\n${summary}\n` : ""}
🔗 [Részletek az idővonalon](${url})`;

console.log(message);
