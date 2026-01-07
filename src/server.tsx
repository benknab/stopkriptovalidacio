import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { languageDetector } from "@hono/hono/language";
import { setCookie } from "@hono/hono/cookie";
import { renderToReadableStream } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { App } from "./components/app.tsx";
import { Document } from "./components/document.tsx";
import {
	createI18nInstance,
	fallbackLanguage,
	isValidLanguage,
	type SupportedLanguage,
	supportedLanguages,
} from "./i18n/index.ts";

type AppEnv = {
	Variables: {
		language: string;
	};
};

const app = new Hono<AppEnv>();

// Language detection middleware
app.use(
	languageDetector({
		supportedLanguages: [...supportedLanguages],
		fallbackLanguage: fallbackLanguage,
		order: ["cookie", "header"],
		lookupCookie: "lang",
	}),
);

// Serve static files from /public
app.use("/public/*", serveStatic({ root: "./" }));

// Language switch route
app.get("/set-lang", (c) => {
	const lang = c.req.query("lang");
	const redirect = c.req.query("redirect") || "/";

	if (lang && isValidLanguage(lang)) {
		setCookie(c, "lang", lang, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365,
			sameSite: "Lax",
		});
	}

	return c.redirect(redirect);
});

// Main route
app.get("/", async (c) => {
	const detectedLang = c.get("language");
	const lang: SupportedLanguage = isValidLanguage(detectedLang) ? detectedLang : fallbackLanguage;
	const i18n = createI18nInstance(lang);

	const stream = await renderToReadableStream(
		<I18nextProvider i18n={i18n}>
			<Document lang={lang}>
				<App />
			</Document>
		</I18nextProvider>,
	);

	return new Response(stream, {
		headers: { "Content-Type": "text/html; charset=utf-8" },
	});
});

const port = Number.parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server running at http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
