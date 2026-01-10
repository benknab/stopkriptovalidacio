// deno-lint-ignore-file react-no-danger
import type { JSX } from "preact";
import type { SupportedLanguage } from "../../i18n/index.ts";
import { t } from "../../i18n/index.ts";
import { type PageId, SITE_NAME, SITE_URL } from "../../constants/seo.ts";
import { getPrimaryEvents } from "../../utils/seo.ts";

export interface PersonData {
	name: string;
	party: string;
	slug: string;
}

interface JsonLdProps {
	lang: SupportedLanguage;
	pageId: PageId;
	path?: string;
	personData?: PersonData;
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

function buildPersonSchema(personData: PersonData, lang: SupportedLanguage): object {
	return {
		"@type": "Person",
		"@id": `${SITE_URL}/parlament/${personData.slug}#person`,
		name: personData.name,
		jobTitle: lang === "hu" ? "Országgyűlési képviselő" : "Member of Parliament",
		affiliation: {
			"@type": "Organization",
			name: personData.party,
		},
		url: `${SITE_URL}/parlament/${personData.slug}`,
		image: `/images/mps/${personData.slug}.jpg`,
	};
}

function buildBreadcrumbSchema(
	items: Array<{ name: string; url: string }>,
): object {
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

export function JsonLd({ lang, pageId, path, personData }: JsonLdProps): JSX.Element {
	const graph: object[] = [];
	const siteTitle = t("site.title", lang);

	graph.push(buildWebSiteSchema(siteTitle));

	// Add breadcrumb schema for all pages
	const breadcrumbItems: Array<{ name: string; url: string }> = [
		{ name: siteTitle, url: SITE_URL },
	];

	if (pageId === "home") {
		const primaryEvents = getPrimaryEvents();

		const dates = primaryEvents.map(([_, e]) => e.date);
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

	if (pageId === "about") {
		breadcrumbItems.push({
			name: t("nav.about", lang),
			url: `${SITE_URL}/rolunk`,
		});
	}

	if (pageId === "mp-detail" && personData) {
		graph.push(buildPersonSchema(personData, lang));
		breadcrumbItems.push({
			name: t("nav.mps", lang),
			url: `${SITE_URL}/#kepviselok`,
		});
		breadcrumbItems.push({
			name: personData.name,
			url: `${SITE_URL}${path || `/parlament/${personData.slug}`}`,
		});
	}

	// Add breadcrumb if we have more than just the home item
	if (breadcrumbItems.length > 1) {
		graph.push(buildBreadcrumbSchema(breadcrumbItems));
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
