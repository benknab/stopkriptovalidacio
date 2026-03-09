import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import type { JSX } from "preact";
import { Layout } from "../../components/layout.tsx";
import { SeoHead } from "../../components/seo/seo-head.tsx";
import { detectLanguage } from "../../i18n/index.ts";
import MpsSection from "../../islands/mps-section.tsx";

export default define.page(function Ogy2022Page(ctx): JSX.Element {
	const url = new URL(ctx.req.url);
	const lang = detectLanguage(ctx.req);
	const mpCounty = url.searchParams.get("megye") || "";
	const mpDistrict = url.searchParams.get("kerulet") || "";
	const currentPath = url.pathname + url.search;

	return (
		<Layout
			lang={lang}
			currentPath={currentPath}
			bgClass="bg-slate-50"
			afterContent={
				<MpsSection
					lang={lang}
					selectedCounty={mpCounty}
					selectedDistrict={mpDistrict}
				/>
			}
			hero={
				<Head>
					<SeoHead lang={lang} pageId="ogy2022" path="/ogy2022" />
				</Head>
			}
		>
			{null}
		</Layout>
	);
});
