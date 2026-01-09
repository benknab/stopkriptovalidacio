import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { HttpError } from "fresh";
import type { JSX } from "preact";
import { ExternalLink } from "../../components/external-link.tsx";
import { Layout } from "../../components/layout.tsx";
import { Link } from "../../components/link.tsx";
import { SeoHead } from "../../components/seo/seo-head.tsx";
import { formatPhoneForDisplay, mps, type MpSlug } from "../../data/mps.ts";
import { detectLanguage, t } from "../../i18n/index.ts";
import { voteColors } from "../../islands/mps-section.tsx";

function buildBackUrl(county: string, district: string): string {
	const params = new URLSearchParams();
	if (county) params.set("megye", county);
	if (district) params.set("kerulet", district);
	const query = params.toString();
	return `/${query ? `?${query}` : ""}#kepviselok`;
}

function EmailIcon(): JSX.Element {
	return (
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={2}
				d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
			/>
		</svg>
	);
}

function PhoneIcon(): JSX.Element {
	return (
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={2}
				d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
			/>
		</svg>
	);
}

function WebsiteIcon(): JSX.Element {
	return (
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={2}
				d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
			/>
		</svg>
	);
}

function AddressIcon(): JSX.Element {
	return (
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={2}
				d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={2}
				d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
}

function BackIcon(): JSX.Element {
	return (
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
		</svg>
	);
}

export default define.page(function MpDetailPage(ctx): JSX.Element {
	const slug = ctx.params.slug as MpSlug;
	const mp = mps[slug];

	if (!mp) {
		throw new HttpError(404);
	}

	const url = new URL(ctx.req.url);
	const lang = detectLanguage(ctx.req);
	const selectedCounty = url.searchParams.get("megye") || "";
	const selectedDistrict = url.searchParams.get("kerulet") || "";
	const currentPath = url.pathname + url.search;

	const colors = voteColors[mp.vote];
	const emails = Array.from(mp.emails);
	const phones = Array.from(mp.phones);
	const backUrl = buildBackUrl(selectedCounty, selectedDistrict);

	return (
		<Layout lang={lang} currentPath={currentPath}>
			<Head>
				<SeoHead
					lang={lang}
					pageId="mp-detail"
					path={`/parlament/${slug}`}
					titleParams={{ name: mp.name }}
					descriptionParams={{ name: mp.name }}
				/>
			</Head>
			{/* Back link */}
			<a
				href={backUrl}
				class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8"
			>
				<BackIcon />
				<span>{t("mps.back_to_list", lang)}</span>
			</a>

			{/* MP Card */}
			<div class={`bg-white rounded-xl border-2 ${colors.border} p-6 sm:p-8`}>
				{/* Header: Photo + Basic Info */}
				<div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
					{mp.imageUrl
						? (
							<img
								src={mp.imageUrl}
								alt={mp.name}
								class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-slate-200"
							/>
						)
						: (
							<div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
								<span class="text-slate-400 text-4xl">👤</span>
							</div>
						)}

					<div class="text-center sm:text-left flex-1">
						<h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{mp.name}</h1>
						<p class="text-lg text-slate-600 mb-2">
							{t(`mps.party.${mp.party}`, lang, { defaultValue: mp.party })}
						</p>
						{mp.district && <p class="text-slate-500">{mp.district}</p>}
						<span
							class={`inline-block mt-3 text-sm font-medium px-3 py-1.5 rounded-full ${colors.badge}`}
						>
							{t(`mps.vote.${mp.vote}`, lang)}
						</span>
					</div>
				</div>

				{/* Contact Section */}
				<div class="border-t border-slate-200 pt-6">
					<h2 class="text-lg font-semibold text-slate-900 mb-4">{t("mps.contact", lang)}</h2>

					<div class="space-y-4">
						{/* Website */}
						{mp.website && (
							<div class="flex items-start gap-3">
								<span class="text-slate-400 mt-0.5">
									<WebsiteIcon />
								</span>
								<ExternalLink href={mp.website} class="break-all">
									{mp.website.replace(/^https?:\/\//, "")}
								</ExternalLink>
							</div>
						)}

						{/* Emails */}
						{emails.length > 0 && (
							<div class="flex items-start gap-3">
								<span class="text-slate-400 mt-0.5">
									<EmailIcon />
								</span>
								<div class="space-y-1">
									{emails.map((email) => (
										<Link key={email} href={`mailto:${email}`} class="block break-all">
											{email}
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Phones */}
						{phones.length > 0 && (
							<div class="flex items-start gap-3">
								<span class="text-slate-400 mt-0.5">
									<PhoneIcon />
								</span>
								<div class="space-y-1">
									{phones.map((phone) => (
										<Link key={phone} href={`tel:+${phone}`} class="block font-mono">
											{formatPhoneForDisplay(phone)}
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Address */}
						{mp.address && (
							<div class="flex items-start gap-3">
								<span class="text-slate-400 mt-0.5">
									<AddressIcon />
								</span>
								<p class="text-slate-700">{mp.address}</p>
							</div>
						)}

						{/* No contact info message */}
						{emails.length === 0 && phones.length === 0 && !mp.website && !mp.address && (
							<p class="text-slate-400 italic">–</p>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
});
