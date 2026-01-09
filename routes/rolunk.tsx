import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import type { JSX } from "preact";
import { ExternalLink } from "../components/external-link.tsx";
import { H2 } from "../components/h2.tsx";
import { Layout } from "../components/layout.tsx";
import { Link } from "../components/link.tsx";
import { SeoHead } from "../components/seo/seo-head.tsx";
import { detectLanguage, type SupportedLanguage, t } from "../i18n/index.ts";

// Helper to parse text with embedded links like <emailLink>...</emailLink>
function parseTextWithLinks(
	text: string,
	_lang: SupportedLanguage,
	linkMap: Record<string, { href: string; external?: boolean }>,
): JSX.Element {
	const parts: (string | JSX.Element)[] = [];
	let key = 0;

	const tagRegex = /<(\w+)>(.*?)<\/\1>/g;
	let match;
	let lastIndex = 0;

	while ((match = tagRegex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push(text.slice(lastIndex, match.index));
		}

		const tagName = match[1];
		const content = match[2];
		const linkInfo = linkMap[tagName];

		if (linkInfo) {
			if (linkInfo.external) {
				parts.push(
					<ExternalLink key={key++} href={linkInfo.href} class="underline">
						{content}
					</ExternalLink>,
				);
			} else {
				parts.push(
					<Link key={key++} href={linkInfo.href}>
						{content}
					</Link>,
				);
			}
		} else {
			parts.push(content);
		}

		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex));
	}

	return <>{parts}</>;
}

export default define.page(function About(ctx): JSX.Element {
	const url = new URL(ctx.req.url);
	const lang = detectLanguage(ctx.req);
	const currentPath = url.pathname + url.search;

	return (
		<Layout lang={lang} currentPath={currentPath}>
			<Head>
				<SeoHead lang={lang} pageId="about" path="/rolunk" />
			</Head>
			<h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-8">{t("about.title", lang)}</h1>

			{/* Mission Section */}
			<section class="mb-12">
				<H2 class="mb-4 text-left text-2xl sm:text-2xl">{t("about.mission.title", lang)}</H2>
				<div class="space-y-4 text-slate-600 leading-relaxed">
					<p>{t("about.mission.description", lang)}</p>
					<p>{t("about.mission.privacy", lang)}</p>
					<p>{t("about.mission.platform", lang)}</p>
					<p class="font-medium">{t("about.mission.disclaimer", lang)}</p>
				</div>
			</section>

			{/* Privacy Policy Section */}
			<section id="adatvedelem" class="mb-12">
				<H2 class="mb-4 text-left text-2xl sm:text-2xl">{t("about.privacy.title", lang)}</H2>
				<div class="space-y-4 text-slate-600 leading-relaxed">
					<p>{t("about.privacy.email", lang)}</p>
					<p>
						{parseTextWithLinks(t("about.privacy.analytics", lang), lang, {
							plausibleLink: { href: "https://plausible.io/privacy", external: true },
						})}
					</p>
					<p>
						{parseTextWithLinks(t("about.privacy.cloudflare", lang), lang, {
							cloudflareLink: { href: "https://www.cloudflare.com/privacypolicy/", external: true },
						})}
					</p>
					<p>{t("about.privacy.changes", lang)}</p>
					<p class="text-sm text-slate-500">{t("about.privacy.updated", lang)}</p>
				</div>
			</section>

			{/* Contact Section */}
			<section id="kontakt">
				<H2 class="mb-4 text-left text-2xl sm:text-2xl">{t("about.contact.title", lang)}</H2>
				<p class="text-slate-600 leading-relaxed">
					{parseTextWithLinks(t("about.contact.description", lang), lang, {
						emailLink: { href: "mailto:info@kriptovalidacio.hu" },
					})}
				</p>
			</section>
		</Layout>
	);
});
