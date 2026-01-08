import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "../../i18n/index.ts";
import { buildCanonicalUrl } from "../../utils/seo.ts";
import { DEFAULT_OG_IMAGE, OG_LOCALES, SITE_URL } from "../../constants/seo.ts";

interface OpenGraphProps {
	lang: SupportedLanguage;
	titleKey: string;
	descriptionKey: string;
	path: string;
	type: "website" | "article";
}

export function OpenGraph({
	lang,
	titleKey,
	descriptionKey,
	path,
	type,
}: OpenGraphProps): JSX.Element {
	const { t } = useTranslation();
	const title = t(titleKey);
	const description = t(descriptionKey);
	const url = buildCanonicalUrl(path);
	const imageUrl = `${SITE_URL}${DEFAULT_OG_IMAGE}`;

	const ogLocale = OG_LOCALES[lang];
	const ogLocaleAlternate = lang === "hu" ? OG_LOCALES.en : OG_LOCALES.hu;

	return (
		<>
			{/* Open Graph */}
			<meta property="og:type" content={type} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={url} />
			<meta property="og:image" content={imageUrl} />
			<meta property="og:locale" content={ogLocale} />
			<meta property="og:locale:alternate" content={ogLocaleAlternate} />
			<meta property="og:site_name" content={t("site.title")} />

			{/* Twitter Card */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={imageUrl} />
		</>
	);
}
