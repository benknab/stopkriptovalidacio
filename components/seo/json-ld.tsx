import type { JSX } from "react";
import type { SupportedLanguage } from "../../i18n/index.ts";
import { t } from "../../i18n/index.ts";
import { type PageId, SITE_NAME, SITE_URL } from "../../constants/seo.ts";
import { getPrimaryEvents } from "../../utils/seo.ts";
import { localizePath } from "../../utils/localized-path.ts";
import { BUILD_DATE } from "../../constants/build.ts";

interface JsonLdProps {
	lang: SupportedLanguage;
	pageId: PageId;
}

function buildWebSiteSchema(siteName: string): object {
	return {
		"@type": "WebSite",
		"@id": `${SITE_URL}/#website`,
		url: SITE_URL,
		name: siteName,
		inLanguage: ["hu", "en"],
	};
}

const KEYWORDS = {
	hu: ["kripto validálás", "kripto validátor", "kripto validáció", "kripto szabályozás", "kripto törvény"],
	en: ["crypto validation", "crypto validator", "crypto validation", "crypto regulation", "crypto law"],
} as const;

function buildArticleSchema(
	lang: SupportedLanguage,
	title: string,
	description: string,
	datePublished: string,
	dateModified: string,
): object {
	return {
		"@type": "Article",
		"@id": `${SITE_URL}${localizePath("/", lang)}#article`,
		headline: title,
		description: description,
		inLanguage: lang,
		datePublished: datePublished,
		dateModified: dateModified,
		keywords: KEYWORDS[lang],
		publisher: {
			"@type": "Organization",
			name: SITE_NAME,
			url: SITE_URL,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${SITE_URL}${localizePath("/", lang)}`,
		},
	};
}

function buildNewsArticleSchema(
	slug: string,
	title: string,
	summary: string,
	datePublished: string,
	lang: SupportedLanguage,
): object {
	return {
		"@type": "NewsArticle",
		"@id": `${SITE_URL}${localizePath("/", lang)}#event-${slug}`,
		headline: title,
		description: summary,
		datePublished: datePublished,
		inLanguage: lang,
		publisher: {
			"@type": "Organization",
			name: SITE_NAME,
			url: SITE_URL,
		},
	};
}

function buildItemListSchema(items: object[]): object {
	return {
		"@type": "ItemList",
		"@id": `${SITE_URL}/#timeline`,
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: item,
		})),
	};
}

function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
	return {
		"@type": "BreadcrumbList",
		"@id": `${SITE_URL}/#breadcrumb`,
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

export function buildJsonLd({ lang, pageId }: JsonLdProps) {
	const graph: object[] = [];
	const siteTitle = t("site.title", lang);

	graph.push(buildWebSiteSchema(siteTitle));

	// Add breadcrumb schema for all pages
	const breadcrumbItems: Array<{ name: string; url: string }> = [
		{ name: siteTitle, url: `${SITE_URL}${localizePath("/", lang)}` },
	];

	if (pageId === "home") {
		const primaryEvents = getPrimaryEvents();

		const dates = primaryEvents.map(([, event]) => event.date);
		const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
		const latest = new Date(Math.max(...dates.map((d) => d.getTime())));

		graph.push(
			buildArticleSchema(
				lang,
				t("seo.home.title", lang),
				t("seo.home.description", lang),
				earliest.toISOString(),
				latest.toISOString(),
			),
		);

		const newsArticles = primaryEvents.map(([slug, event]) =>
			buildNewsArticleSchema(slug, event.title[lang], event.summary?.[lang] || "", event.date.toISOString(), lang),
		);

		graph.push(buildItemListSchema(newsArticles));
	}

	if (pageId === "about") {
		breadcrumbItems.push({
			name: t("nav.about", lang),
			url: `${SITE_URL}${localizePath("/rolunk", lang)}`,
		});
	}

	if (pageId === "crypto-validation") {
		graph.push(
			buildArticleSchema(
				lang,
				t("seo.crypto_validation.title", lang),
				t("seo.crypto_validation.description", lang),
				"2025-07-01",
				BUILD_DATE.toISOString().split("T")[0],
			),
		);
		breadcrumbItems.push({
			name: t("crypto_validation.title", lang),
			url: `${SITE_URL}${localizePath("/kriptovalidalas", lang)}`,
		});
	}

	if (pageId === "vote-history") {
		const today = BUILD_DATE.toISOString().split("T")[0];
		graph.push(
			buildArticleSchema(
				lang,
				t("seo.vote_history.title", lang),
				t("seo.vote_history.description", lang),
				today,
				today,
			),
		);
		breadcrumbItems.push({
			name: t("vote_history.title", lang),
			url: `${SITE_URL}${localizePath("/szavazas", lang)}`,
		});
	}

	// Add breadcrumb if we have more than just the home item
	if (breadcrumbItems.length > 1) {
		graph.push(buildBreadcrumbSchema(breadcrumbItems));
	}

	return {
		"@context": "https://schema.org",
		"@graph": graph,
	};
}

export function JsonLd(props: JsonLdProps): JSX.Element {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(props)).replaceAll("<", "\\u003c") }}
		/>
	);
}
