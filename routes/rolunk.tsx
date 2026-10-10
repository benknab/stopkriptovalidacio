import { createFileRoute, useLocation } from "@tanstack/react-router";
import type { JSX } from "react";
import { ExternalLink } from "../components/external-link.tsx";
import { H2 } from "../components/h2.tsx";
import { Layout } from "../components/layout.tsx";
import { Link } from "../components/link.tsx";
import { getPageHead } from "../utils/page-head.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";

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
					<ExternalLink key={key++} href={linkInfo.href} className="underline">
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

export const Route = createFileRoute("/rolunk")({
	head: ({ matches }) => getPageHead(matches[0].context.lang, "about", "/rolunk"),
	component: About,
});

function About(): JSX.Element {
	const { lang } = Route.useRouteContext();
	const currentPath = useLocation({ select: (location) => location.pathname + location.searchStr });

	return (
		<Layout lang={lang} currentPath={currentPath}>
			<h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">{t("about.title", lang)}</h1>

			{/* Mission Section */}
			<section className="mb-12">
				<H2 className="mb-4 text-left text-2xl sm:text-2xl">{t("about.mission.title", lang)}</H2>
				<div className="space-y-4 text-slate-600 leading-relaxed">
					<p>{t("about.mission.description", lang)}</p>
					<p>{t("about.mission.privacy", lang)}</p>
					<p>{t("about.mission.platform", lang)}</p>
					<p>
						{parseTextWithLinks(t("about.mission.inspiration", lang), lang, {
							fightChatPolicyLink: {
								href: "https://fightchatcontrol.eu",
								external: true,
							},
						})}
					</p>
					<p className="font-medium">{t("about.mission.disclaimer", lang)}</p>
				</div>
			</section>

			{/* Privacy Policy Section */}
			<section id="adatvedelem" className="mb-12">
				<H2 className="mb-4 text-left text-2xl sm:text-2xl">{t("about.privacy.title", lang)}</H2>
				<div className="space-y-4 text-slate-600 leading-relaxed">
					<p>{t("about.privacy.email", lang)}</p>
					<p>
						{parseTextWithLinks(t("about.privacy.analytics", lang), lang, {
							umamiLink: { href: "https://umami.is/privacy", external: true },
						})}
					</p>
					<p>
						{parseTextWithLinks(t("about.privacy.cloudflare", lang), lang, {
							cloudflareLink: {
								href: "https://www.cloudflare.com/privacypolicy/",
								external: true,
							},
						})}
					</p>
					<p>{t("about.privacy.changes", lang)}</p>
					<p className="text-sm text-slate-500">{t("about.privacy.updated", lang)}</p>
				</div>
			</section>

			{/* Contact Section */}
			<section id="kontakt" className="mb-12">
				<H2 className="mb-4 text-left text-2xl sm:text-2xl">{t("about.contact.title", lang)}</H2>
				<p className="text-slate-600 leading-relaxed">
					{parseTextWithLinks(t("about.contact.description", lang), lang, {
						emailLink: { href: "mailto:info@stopkriptovalidacio.hu" },
					})}
				</p>
			</section>

			{/* Contributions Section */}
			<section id="kozremukodes">
				<H2 className="mb-4 text-left text-2xl sm:text-2xl">{t("about.contributions.title", lang)}</H2>
				<div className="space-y-4 text-slate-600 leading-relaxed">
					<p>
						{parseTextWithLinks(t("about.contributions.description", lang), lang, {
							githubLink: {
								href: "https://github.com/benknab/stopkriptovalidacio",
								external: true,
							},
						})}
					</p>
					<p>{t("about.contributions.howto", lang)}</p>
				</div>
			</section>
		</Layout>
	);
}
