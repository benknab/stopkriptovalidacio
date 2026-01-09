export const SITE_URL = "https://kriptovalidacio.hu";
export const SITE_NAME = "Kriptovalidacio";
export const DEFAULT_OG_IMAGE = "/public/og-image.png";

export const OG_LOCALES = {
	hu: "hu_HU",
	en: "en_US",
} as const;

export const PAGE_SEO_CONFIG = {
	home: {
		path: "/",
		titleKey: "seo.home.title",
		descriptionKey: "seo.home.description",
		type: "article",
	},
	about: {
		path: "/rolunk",
		titleKey: "seo.about.title",
		descriptionKey: "seo.about.description",
		type: "website",
	},
	"mp-detail": {
		path: "/parlament/:slug",
		titleKey: "seo.mp_detail.title",
		descriptionKey: "seo.mp_detail.description",
		type: "profile",
	},
} as const;

export type PageId = keyof typeof PAGE_SEO_CONFIG;
