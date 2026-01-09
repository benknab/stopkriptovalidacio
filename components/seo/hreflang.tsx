import type { JSX } from "preact";
import { buildHreflangUrls } from "../../utils/seo.ts";

interface HreflangProps {
	path: string;
}

export function Hreflang({ path }: HreflangProps): JSX.Element {
	const hreflangUrls = buildHreflangUrls(path);

	return (
		<>
			{hreflangUrls.map(({ lang, url }) => <link key={lang} rel="alternate" hrefLang={lang} href={url} />)}
		</>
	);
}
