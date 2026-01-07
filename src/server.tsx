import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { renderToReadableStream } from "react-dom/server";
import { App } from "./components/app.tsx";
import { Document } from "./components/document.tsx";

const app = new Hono();

// Serve static files from /public
app.use("/public/*", serveStatic({ root: "./" }));

// Main route
app.get("/", async (_c) => {
	const stream = await renderToReadableStream(
		<Document>
			<App />
		</Document>,
	);
	return new Response(stream, {
		headers: { "Content-Type": "text/html; charset=utf-8" },
	});
});

const port = parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server running at http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
