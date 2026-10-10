import { PAGE_SEO_CONFIG, type PageId, DEFAULT_OG_IMAGE, OG_LOCALES, SITE_URL } from "../constants/seo.ts";
import { buildJsonLd } from "../components/seo/json-ld.tsx";
import { sources } from "../data/sources.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { buildCanonicalUrl, buildHreflangUrls } from "./seo.ts";

const ICON_LINKS = [
	{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
	{ rel: "icon", href: "/favicon-48.png", sizes: "48x48", type: "image/png" },
	{ rel: "icon", href: "/favicon-192.png", sizes: "192x192", type: "image/png" },
	{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
];

export function getPageHead(lang: SupportedLanguage, pageId: PageId, path: string) {
	const config = PAGE_SEO_CONFIG[pageId];
	const title = t(config.titleKey, lang);
	const description = t(config.descriptionKey, lang);
	const image = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
	return {
		meta: [
			{ title },
			{ name: "description", content: description },
			{ name: "robots", content: "index, follow" },
			{ property: "og:type", content: config.type },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:url", content: buildCanonicalUrl(path, lang) },
			{ property: "og:image", content: image },
			{ property: "og:locale", content: OG_LOCALES[lang] },
			{ property: "og:locale:alternate", content: OG_LOCALES[lang === "hu" ? "en" : "hu"] },
			{ property: "og:site_name", content: t("site.title", lang) },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: image },
		],
		links: [
			{ rel: "canonical", href: buildCanonicalUrl(path, lang) },
			...ICON_LINKS,
			...buildHreflangUrls(path).map(({ lang, url }) => ({ rel: "alternate", hrefLang: lang, href: url })),
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(buildJsonLd({ lang, pageId })).replaceAll("<", "\\u003c"),
			},
		],
	};
}

export function getSourceHead(lang: SupportedLanguage, slug: string) {
	const source = sources[slug];
	if (!source || source.originalUrl || source.internalUrl) return {};
	return {
		meta: [
			{ title: t("source.page_title", lang, { title: source.title[lang] }) },
			{ name: "description", content: t("source.page_description", lang) },
			{ name: "robots", content: "noindex, nofollow" },
		],
		links: [
			{ rel: "canonical", href: buildCanonicalUrl(`/forras/${slug}`, lang) },
			...ICON_LINKS,
			...buildHreflangUrls(`/forras/${slug}`).map(({ lang, url }) => ({ rel: "alternate", hrefLang: lang, href: url })),
		],
	};
}
