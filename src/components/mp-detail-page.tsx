import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { formatPhoneForDisplay, type Mp, type MpSlug } from "../data/mps.ts";
import type { SupportedLanguage } from "../i18n/index.ts";
import { ExternalLink } from "./external-link.tsx";
import { Layout } from "./layout.tsx";
import { Link } from "./link.tsx";
import { voteColors } from "./mps-section.tsx";

interface MpDetailPageProps {
	slug: MpSlug;
	mp: Mp;
	currentPath: string;
	selectedCounty: string;
	selectedDistrict: string;
}

function buildBackUrl(county: string, district: string): string {
	const params = new URLSearchParams();
	if (county) params.set("megye", county);
	if (district) params.set("kerulet", district);
	const query = params.toString();
	return `/${query ? `?${query}` : ""}#kepviselok`;
}

function EmailIcon(): JSX.Element {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
			/>
		</svg>
	);
}

function PhoneIcon(): JSX.Element {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
			/>
		</svg>
	);
}

function WebsiteIcon(): JSX.Element {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
			/>
		</svg>
	);
}

function AddressIcon(): JSX.Element {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
			/>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
		</svg>
	);
}

function BackIcon(): JSX.Element {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
		</svg>
	);
}

export function MpDetailPage({ mp, currentPath, selectedCounty, selectedDistrict }: MpDetailPageProps): JSX.Element {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language as SupportedLanguage;
	const colors = voteColors[mp.vote];
	const emails = Array.from(mp.emails);
	const phones = Array.from(mp.phones);
	const backUrl = buildBackUrl(selectedCounty, selectedDistrict);

	return (
		<Layout currentLang={currentLang} currentPath={currentPath}>
			{/* Back link */}
			<a
				href={backUrl}
				className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8"
			>
				<BackIcon />
				<span>{t("mps.back_to_list")}</span>
			</a>

			{/* MP Card */}
			<div className={`bg-white rounded-xl border-2 ${colors.border} p-6 sm:p-8`}>
				{/* Header: Photo + Basic Info */}
				<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
					{mp.imageUrl
						? (
							<img
								src={mp.imageUrl}
								alt={mp.name}
								className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-slate-200"
							/>
						)
						: (
							<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
								<span className="text-slate-400 text-4xl">👤</span>
							</div>
						)}

					<div className="text-center sm:text-left flex-1">
						<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{mp.name}</h1>
						<p className="text-lg text-slate-600 mb-2">{t(`mps.party.${mp.party}`, mp.party)}</p>
						{mp.district && <p className="text-slate-500">{mp.district}</p>}
						<span
							className={`inline-block mt-3 text-sm font-medium px-3 py-1.5 rounded-full ${colors.badge}`}
						>
							{t(`mps.vote.${mp.vote}`)}
						</span>
					</div>
				</div>

				{/* Contact Section */}
				<div className="border-t border-slate-200 pt-6">
					<h2 className="text-lg font-semibold text-slate-900 mb-4">{t("mps.contact")}</h2>

					<div className="space-y-4">
						{/* Website */}
						{mp.website && (
							<div className="flex items-start gap-3">
								<span className="text-slate-400 mt-0.5">
									<WebsiteIcon />
								</span>
								<ExternalLink href={mp.website} className="break-all">
									{mp.website.replace(/^https?:\/\//, "")}
								</ExternalLink>
							</div>
						)}

						{/* Emails */}
						{emails.length > 0 && (
							<div className="flex items-start gap-3">
								<span className="text-slate-400 mt-0.5">
									<EmailIcon />
								</span>
								<div className="space-y-1">
									{emails.map((email) => (
										<Link key={email} href={`mailto:${email}`} className="block break-all">
											{email}
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Phones */}
						{phones.length > 0 && (
							<div className="flex items-start gap-3">
								<span className="text-slate-400 mt-0.5">
									<PhoneIcon />
								</span>
								<div className="space-y-1">
									{phones.map((phone) => (
										<Link key={phone} href={`tel:+${phone}`} className="block font-mono">
											{formatPhoneForDisplay(phone)}
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Address */}
						{mp.address && (
							<div className="flex items-start gap-3">
								<span className="text-slate-400 mt-0.5">
									<AddressIcon />
								</span>
								<p className="text-slate-700">{mp.address}</p>
							</div>
						)}

						{/* No contact info message */}
						{emails.length === 0 && phones.length === 0 && !mp.website && !mp.address && (
							<p className="text-slate-400 italic">–</p>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
}
