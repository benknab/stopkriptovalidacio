import type { Context } from "@hono/hono";
import type { JSX } from "react";
import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { languageDetector } from "@hono/hono/language";
import { setCookie } from "@hono/hono/cookie";
import { renderToReadableStream } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { About } from "./components/about.tsx";
import { App } from "./components/app.tsx";
import { Document } from "./components/document.tsx";
import {
	createI18nInstance,
	fallbackLanguage,
	isValidLanguage,
	type SupportedLanguage,
	supportedLanguages,
} from "./i18n/index.ts";
import { PAGE_SEO_CONFIG, type PageId, SITE_URL } from "./constants/seo.ts";
import { formatISODate, getLastModifiedDate } from "./utils/seo.ts";

type AppEnv = {
	Variables: {
		language: string;
	};
};

const app = new Hono<AppEnv>();

async function renderPage(c: Context<AppEnv>, Page: () => JSX.Element, pageId: PageId): Promise<Response> {
	const detectedLang = c.get("language");
	const lang: SupportedLanguage = isValidLanguage(detectedLang) ? detectedLang : fallbackLanguage;
	const i18n = createI18nInstance(lang);
	const path = new URL(c.req.url).pathname;

	const stream = await renderToReadableStream(
		<I18nextProvider i18n={i18n}>
			<Document lang={lang} pageId={pageId} path={path}>
				<Page />
			</Document>
		</I18nextProvider>,
	);

	return new Response(stream, {
		headers: { "Content-Type": "text/html; charset=utf-8" },
	});
}

// Language detection middleware
app.use(
	languageDetector({
		supportedLanguages: [...supportedLanguages],
		fallbackLanguage: fallbackLanguage,
		order: ["cookie", "header"],
		lookupCookie: "lang",
	}),
);

// Serve static files
app.use("/public/*", serveStatic({ root: "./" }));
app.get("/bitcoin.pdf", serveStatic({ path: "./public/bitcoin.pdf" }));

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

// SEO routes
app.get("/robots.txt", (c) => {
	const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml`;

	return c.text(robotsTxt, 200, {
		"Content-Type": "text/plain; charset=utf-8",
	});
});

app.get("/sitemap.xml", (c) => {
	const lastMod = formatISODate(getLastModifiedDate());

	const urls = (Object.keys(PAGE_SEO_CONFIG) as PageId[]).map((pageId) => {
		const config = PAGE_SEO_CONFIG[pageId];
		const url = `${SITE_URL}${config.path}`;
		const priority = pageId === "home" ? "1.0" : "0.8";

		const hreflangLinks = supportedLanguages
			.map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}"/>`)
			.join("\n");

		return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${hreflangLinks}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url}"/>
  </url>`;
	});

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

	return c.text(sitemap, 200, {
		"Content-Type": "application/xml; charset=utf-8",
	});
});

// Routes
app.get("/", (c) => {
	const showAll = c.req.query("osszes") === "true";
	const mpCounty = c.req.query("megye") || "";
	const mpDistrict = c.req.query("kerulet") || "";
	return renderPage(c, () => <App showAllEvents={showAll} mpCounty={mpCounty} mpDistrict={mpDistrict} />, "home");
});
app.get("/rolunk", (c) => renderPage(c, About, "about"));

const port = Number.parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server running at http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
