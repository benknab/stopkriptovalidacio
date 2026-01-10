import type { JSX } from "preact";
import type { SupportedLanguage } from "../../i18n/index.ts";
import { PAGE_SEO_CONFIG, type PageId } from "../../constants/seo.ts";
import { MetaTags } from "./meta-tags.tsx";
import { OpenGraph } from "./open-graph.tsx";
import { Hreflang } from "./hreflang.tsx";
import { JsonLd, type PersonData } from "./json-ld.tsx";

interface SeoHeadProps {
	lang: SupportedLanguage;
	pageId: PageId;
	path: string;
	titleParams?: Record<string, string>;
	descriptionParams?: Record<string, string>;
	personData?: PersonData;
}

export function SeoHead({ lang, pageId, path, titleParams, descriptionParams, personData }: SeoHeadProps): JSX.Element {
	const config = PAGE_SEO_CONFIG[pageId];

	return (
		<>
			<MetaTags
				lang={lang}
				titleKey={config.titleKey}
				descriptionKey={config.descriptionKey}
				canonicalPath={path}
				titleParams={titleParams}
				descriptionParams={descriptionParams}
			/>

			<OpenGraph
				lang={lang}
				titleKey={config.titleKey}
				descriptionKey={config.descriptionKey}
				path={path}
				type={config.type}
				titleParams={titleParams}
				descriptionParams={descriptionParams}
			/>

			<Hreflang path={path} />

			<JsonLd lang={lang} pageId={pageId} path={path} personData={personData} />
		</>
	);
}
