import { SITE_URL } from "../constants/seo.ts";
import { events } from "../data/events.ts";

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

const sortedEvents = Object.entries(events).sort(([, a], [, b]) => a.date.getTime() - b.date.getTime());

for (const [slug, event] of sortedEvents) {
	const title = event.title.hu;
	const date = formatDate(event.date);
	const summary = event.summary ? stripHtml(event.summary.hu) : "";
	const url = `${SITE_URL}/?utm_source=telegram&utm_medium=social&utm_campaign=timeline_update#${slug}`;

	const message = `📅 ${date}
📌 ${title}
${summary ? `\n${summary}\n` : ""}
🔗 [Részletek az idővonalon](${url})`;

	console.log(message);
	console.log("\n---\n");
}
