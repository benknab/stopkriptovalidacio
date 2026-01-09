import type { JSX } from "preact";
import type { SupportedLanguage } from "../../i18n/index.ts";
import { t } from "../../i18n/index.ts";
import { buildCanonicalUrl } from "../../utils/seo.ts";

interface MetaTagsProps {
	lang: SupportedLanguage;
	titleKey: string;
	descriptionKey: string;
	canonicalPath: string;
	noIndex?: boolean;
	titleParams?: Record<string, string>;
	descriptionParams?: Record<string, string>;
}

export function MetaTags({
	lang,
	titleKey,
	descriptionKey,
	canonicalPath,
	noIndex = false,
	titleParams,
	descriptionParams,
}: MetaTagsProps): JSX.Element {
	const title = t(titleKey, lang, titleParams);
	const description = t(descriptionKey, lang, descriptionParams);
	const canonicalUrl = buildCanonicalUrl(canonicalPath);

	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
			<link rel="canonical" href={canonicalUrl} />
			<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
		</>
	);
}
