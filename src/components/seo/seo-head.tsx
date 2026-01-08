import type { JSX } from "react";
import type { SupportedLanguage } from "../../i18n/index.ts";
import { PAGE_SEO_CONFIG, type PageId } from "../../constants/seo.ts";
import { MetaTags } from "./meta-tags.tsx";
import { OpenGraph } from "./open-graph.tsx";
import { Hreflang } from "./hreflang.tsx";
import { JsonLd } from "./json-ld.tsx";

interface SeoHeadProps {
	lang: SupportedLanguage;
	pageId: PageId;
	path: string;
}

export function SeoHead({ lang, pageId, path }: SeoHeadProps): JSX.Element {
	const config = PAGE_SEO_CONFIG[pageId];

	return (
		<>
			<MetaTags
				titleKey={config.titleKey}
				descriptionKey={config.descriptionKey}
				canonicalPath={path}
			/>

			<OpenGraph
				lang={lang}
				titleKey={config.titleKey}
				descriptionKey={config.descriptionKey}
				path={path}
				type={config.type}
			/>

			<Hreflang path={path} />

			<JsonLd lang={lang} pageId={pageId} />

			<link rel="preload" href="/public/styles.css" as="style" />
		</>
	);
}
