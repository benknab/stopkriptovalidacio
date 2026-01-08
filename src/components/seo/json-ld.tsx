import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "../../i18n/index.ts";
import { SITE_NAME, SITE_URL } from "../../constants/seo.ts";
import { getPrimaryEvents } from "../../utils/seo.ts";

interface JsonLdProps {
	lang: SupportedLanguage;
	pageId: "home" | "about";
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

function buildArticleSchema(
	lang: SupportedLanguage,
	title: string,
	description: string,
	datePublished: string,
	dateModified: string,
): object {
	return {
		"@type": "Article",
		"@id": `${SITE_URL}/#article`,
		headline: title,
		description: description,
		inLanguage: lang,
		datePublished: datePublished,
		dateModified: dateModified,
		publisher: {
			"@type": "Organization",
			name: SITE_NAME,
			url: SITE_URL,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": SITE_URL,
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
		"@id": `${SITE_URL}/#event-${slug}`,
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

export function JsonLd({ lang, pageId }: JsonLdProps): JSX.Element {
	const { t } = useTranslation();

	const graph: object[] = [];

	graph.push(buildWebSiteSchema(t("site.title")));

	if (pageId === "home") {
		const primaryEvents = getPrimaryEvents();

		const dates = primaryEvents.map(([_, e]) => e.date);
		const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
		const latest = new Date(Math.max(...dates.map((d) => d.getTime())));

		graph.push(
			buildArticleSchema(
				lang,
				t("seo.home.title"),
				t("seo.home.description"),
				earliest.toISOString(),
				latest.toISOString(),
			),
		);

		const newsArticles = primaryEvents.map(([slug, event]) =>
			buildNewsArticleSchema(
				slug,
				event.title[lang],
				event.summary?.[lang] || "",
				event.date.toISOString(),
				lang,
			)
		);

		graph.push(buildItemListSchema(newsArticles));
	}

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": graph,
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}
