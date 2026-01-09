import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { buildCanonicalUrl } from "../../utils/seo.ts";

interface MetaTagsProps {
	titleKey: string;
	descriptionKey: string;
	canonicalPath: string;
	noIndex?: boolean;
	titleParams?: Record<string, string>;
	descriptionParams?: Record<string, string>;
}

export function MetaTags({
	titleKey,
	descriptionKey,
	canonicalPath,
	noIndex = false,
	titleParams,
	descriptionParams,
}: MetaTagsProps): JSX.Element {
	const { t } = useTranslation();
	const title = t(titleKey, titleParams);
	const description = t(descriptionKey, descriptionParams);
	const canonicalUrl = buildCanonicalUrl(canonicalPath);

	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
			<link rel="canonical" href={canonicalUrl} />
		</>
	);
}
