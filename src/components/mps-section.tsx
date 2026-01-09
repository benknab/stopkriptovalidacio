import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { type Mp, mps, type MpSlug, type VoteType } from "../data/mps.ts";
import { sources } from "../data/sources.ts";
import type { SupportedLanguage } from "../i18n/index.ts";
import { ExternalLink } from "./external-link.tsx";
import { H2 } from "./h2.tsx";

export const voteColors: Record<VoteType, { badge: string; border: string }> = {
	yes: {
		badge: "bg-red-100 text-red-700",
		border: "border-red-400",
	},
	no: {
		badge: "bg-emerald-100 text-emerald-700",
		border: "border-slate-200",
	},
	abstain: {
		badge: "bg-amber-100 text-amber-700",
		border: "border-red-400",
	},
	absent: {
		badge: "bg-slate-100 text-slate-600",
		border: "border-red-400",
	},
	"not_voted": {
		badge: "bg-slate-100 text-slate-600",
		border: "border-red-400",
	},
	banned: {
		badge: "bg-purple-100 text-purple-700",
		border: "border-slate-200",
	},
};

const votePriority: Record<VoteType, number> = {
	yes: 0,
	abstain: 1,
	"not_voted": 2,
	absent: 3,
	no: 4,
	banned: 5,
};

const NATIONAL_LIST = "Országos lista";
const MINORITY_LIST = "Országos nemzetiségi lista";
export const ALL_OPTION = "__osszes__";

type ParsedDistrict = {
	county: string;
	districtNum: string | null;
	isNationalList: boolean;
};

function parseDistrict(district: string | undefined): ParsedDistrict | null {
	if (!district) return null;

	if (district === NATIONAL_LIST) {
		return { county: NATIONAL_LIST, districtNum: null, isNationalList: true };
	}
	if (district === MINORITY_LIST) {
		return { county: MINORITY_LIST, districtNum: null, isNationalList: true };
	}

	const lastSpaceIndex = district.lastIndexOf(" ");
	if (lastSpaceIndex === -1) return null;

	const withoutOevk = district.substring(0, lastSpaceIndex);
	const spaceBeforeNum = withoutOevk.lastIndexOf(" ");

	if (spaceBeforeNum === -1) return null;

	const county = withoutOevk.substring(0, spaceBeforeNum);
	const districtNum = withoutOevk.substring(spaceBeforeNum + 1) + " OEVK";

	return { county, districtNum, isNationalList: false };
}

type CountyData = {
	name: string;
	districts: string[];
	isNationalList: boolean;
};

function buildCountyData(): CountyData[] {
	const countyMap = new Map<string, Set<string>>();
	const nationalLists: string[] = [];

	for (const mp of Object.values(mps)) {
		const parsed = parseDistrict(mp.district);
		if (!parsed) continue;

		if (parsed.isNationalList) {
			if (!nationalLists.includes(parsed.county)) {
				nationalLists.push(parsed.county);
			}
		} else {
			if (!countyMap.has(parsed.county)) {
				countyMap.set(parsed.county, new Set());
			}
			if (parsed.districtNum) {
				const districts = countyMap.get(parsed.county);
				if (districts) {
					districts.add(parsed.districtNum);
				}
			}
		}
	}

	const result: CountyData[] = [];

	for (const name of nationalLists) {
		result.push({ name, districts: [], isNationalList: true });
	}

	const sortedCounties = Array.from(countyMap.entries()).sort((a, b) => a[0].localeCompare(b[0], "hu"));

	for (const [name, districts] of sortedCounties) {
		const sortedDistricts = Array.from(districts).sort((a, b) => {
			const numA = parseInt(a);
			const numB = parseInt(b);
			return numA - numB;
		});
		result.push({ name, districts: sortedDistricts, isNationalList: false });
	}

	return result;
}

export const countyData = buildCountyData();

function getSortedMps(): Array<{ slug: MpSlug; mp: Mp }> {
	const entries = Object.entries(mps) as Array<[MpSlug, Mp]>;

	return entries
		.map(([slug, mp]) => ({ slug, mp }))
		.sort((a, b) => {
			const priorityDiff = votePriority[a.mp.vote] - votePriority[b.mp.vote];
			if (priorityDiff !== 0) return priorityDiff;
			return a.mp.name.localeCompare(b.mp.name, "hu");
		});
}

const sortedMps = getSortedMps();

function buildMailtoUrl(emails: Set<string>): string | null {
	const [primary, ...cc] = Array.from(emails);
	if (!primary) return null;
	const params = cc.length > 0 ? `?cc=${cc.join(",")}` : "";
	return `mailto:${primary}${params}`;
}

function EmailIcon(): JSX.Element {
	return (
		<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
		<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
			/>
		</svg>
	);
}

function MoreIcon(): JSX.Element {
	return (
		<svg className="w-1 h-4" fill="currentColor" viewBox="0 0 4 16">
			<circle cx="2" cy="2" r="2" />
			<circle cx="2" cy="8" r="2" />
			<circle cx="2" cy="14" r="2" />
		</svg>
	);
}

interface MpCardProps {
	slug: MpSlug;
	mp: Mp;
	selectedCounty: string;
	selectedDistrict: string;
}

function buildMoreUrl(slug: MpSlug, county: string, district: string): string {
	const params = new URLSearchParams();
	if (county) params.set("megye", county);
	if (district) params.set("kerulet", district);
	const query = params.toString();
	return `/parlament/${slug}${query ? `?${query}` : ""}`;
}

function MpCard({ slug, mp, selectedCounty, selectedDistrict }: MpCardProps): JSX.Element {
	const { t } = useTranslation();
	const colors = voteColors[mp.vote];
	const mailtoUrl = buildMailtoUrl(mp.emails);
	const firstPhone = mp.phones.size > 0 ? Array.from(mp.phones)[0] : null;
	const moreUrl = buildMoreUrl(slug, selectedCounty, selectedDistrict);

	return (
		<div
			className={`relative bg-white rounded-xl border-2 ${colors.border} p-5 transition-all duration-200 hover:shadow-md flex flex-col`}
		>
			{/* Vote Badge - Top Right */}
			<span
				className={`absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full ${colors.badge}`}
			>
				{t(`mps.vote.${mp.vote}`)}
			</span>

			{/* Photo */}
			<div className="flex justify-center mb-4">
				{mp.imageUrl
					? (
						<img
							src={mp.imageUrl}
							alt={mp.name}
							className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
						/>
					)
					: (
						<div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
							<span className="text-slate-400 text-2xl">👤</span>
						</div>
					)}
			</div>

			{/* Content */}
			<div className="flex-1 space-y-1 text-center">
				<h3 className="font-bold text-slate-900 text-lg leading-tight">{mp.name}</h3>
				<p className="text-sm text-slate-500">{t(`mps.party.${mp.party}`, mp.party)}</p>
				{mp.district && <p className="text-sm text-slate-600">{mp.district}</p>}
			</div>

			{/* Button Row */}
			<div className="flex gap-2 mt-4">
				{mailtoUrl
					? (
						<a
							href={mailtoUrl}
							className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
						>
							<EmailIcon />
							{t("mps.email")}
						</a>
					)
					: (
						<span className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
							<EmailIcon />
							{t("mps.email")}
						</span>
					)}
				{firstPhone
					? (
						<a
							href={`tel:+${firstPhone}`}
							className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-hover transition-colors"
						>
							<PhoneIcon />
							{t("mps.phone")}
						</a>
					)
					: (
						<span className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
							<PhoneIcon />
							{t("mps.phone")}
						</span>
					)}
				<a
					href={moreUrl}
					className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
				>
					<MoreIcon />
					{t("mps.more")}
				</a>
			</div>
		</div>
	);
}

const mpListSource = {
	label: "Aktív képviselői névsor",
	url: "https://www.parlament.hu/web/guest/aktiv-kepviseloi-nevsor",
};

export interface MpsSectionProps {
	selectedCounty: string;
	selectedDistrict: string;
}

export function MpsSection({ selectedCounty, selectedDistrict }: MpsSectionProps): JSX.Element {
	const { t, i18n } = useTranslation();
	const lang = i18n.language as SupportedLanguage;
	const voteSource = sources["parlament-szavazas-11922"];

	const isAllSelected = selectedCounty === ALL_OPTION;
	const currentCountyData = countyData.find((c) => c.name === selectedCounty);
	const isNationalList = currentCountyData?.isNationalList ?? false;

	const filteredMps = sortedMps.filter(({ mp }) => {
		if (isAllSelected) return true;
		if (!selectedCounty) return false;

		const parsed = parseDistrict(mp.district);
		if (!parsed) return false;

		if (isNationalList) {
			return parsed.county === selectedCounty;
		}

		if (parsed.county !== selectedCounty) return false;
		if (selectedDistrict && parsed.districtNum !== selectedDistrict) return false;

		return true;
	});

	const filterScript = `
		document.addEventListener('DOMContentLoaded', function() {
			var scrollY = sessionStorage.getItem('scrollY');
			if (scrollY) {
				sessionStorage.removeItem('scrollY');
				window.scrollTo(0, parseInt(scrollY));
			}

			var countySelect = document.getElementById('mp-county-select');
			var districtSelect = document.getElementById('mp-district-select');

			if (countySelect) {
				countySelect.addEventListener('change', function() {
					var value = this.value;
					var url = new URL(window.location.href);
					url.hash = 'kepviselok';
					if (value) {
						url.searchParams.set('megye', value);
						url.searchParams.delete('kerulet');
					} else {
						url.searchParams.delete('megye');
						url.searchParams.delete('kerulet');
					}
					sessionStorage.setItem('scrollY', window.scrollY.toString());
					window.location.href = url.toString();
				});
			}

			if (districtSelect) {
				districtSelect.addEventListener('change', function() {
					var value = this.value;
					var url = new URL(window.location.href);
					url.hash = 'kepviselok';
					if (value) {
						url.searchParams.set('kerulet', value);
					} else {
						url.searchParams.delete('kerulet');
					}
					sessionStorage.setItem('scrollY', window.scrollY.toString());
					window.location.href = url.toString();
				});
			}
		});
	`;

	return (
		<section id="kepviselok" className="bg-slate-50 py-16 sm:py-20">
			<script dangerouslySetInnerHTML={{ __html: filterScript }} />
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<H2>{t("mps.title")}</H2>
				<p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
					{t("mps.description")}
				</p>

				<div className="mt-8 p-4 bg-white rounded-lg border border-slate-200 space-y-2">
					<p className="text-sm text-slate-600">
						<strong>{t("mps.source")}:</strong>{" "}
						<ExternalLink href={voteSource.originalUrl} className="underline">
							{voteSource.title[lang]}
						</ExternalLink>
						{" | "}
						<ExternalLink href={mpListSource.url} className="underline">
							{t("mps.mp_list_source")}
						</ExternalLink>
					</p>
					<p className="text-sm text-slate-500">
						{t("mps.district_lookup_hint")}{" "}
						<ExternalLink
							href="https://vtr.valasztas.hu/ogy2022/egyeni-valasztokeruletek"
							className="underline"
						>
							valasztas.hu
						</ExternalLink>
					</p>
				</div>

				<div className="mt-6 grid grid-cols-2 gap-3">
					<div className="relative">
						<label
							htmlFor="mp-county-select"
							className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
						>
							{t("mps.filter.county")}
						</label>
						<select
							id="mp-county-select"
							defaultValue={selectedCounty}
							className="w-full h-11 pl-3 pr-8 bg-white border-2 border-slate-200 rounded-md text-sm text-slate-900 font-medium appearance-none cursor-pointer transition-all duration-150 hover:border-brand/50 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
						>
							<option value="">{t("mps.filter.select_county")}</option>
							<option value={ALL_OPTION}>{t("mps.filter.all")}</option>
							{countyData.map((county) => (
								<option key={county.name} value={county.name}>
									{county.isNationalList
										? t(`mps.filter.${
											county.name === NATIONAL_LIST ? "national_list" : "minority_list"
										}`)
										: county.name}
								</option>
							))}
						</select>
						<div className="pointer-events-none absolute right-3 bottom-3.5">
							<svg
								className="w-4 h-4 text-slate-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>

					<div className="relative">
						<label
							htmlFor="mp-district-select"
							className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 transition-colors ${
								!selectedCounty || isNationalList || isAllSelected ? "text-slate-300" : "text-slate-500"
							}`}
						>
							{t("mps.filter.district")}
						</label>
						<select
							id="mp-district-select"
							defaultValue={selectedDistrict}
							disabled={!selectedCounty || isNationalList || isAllSelected}
							className={`w-full h-11 pl-3 pr-8 border-2 rounded-md text-sm font-medium appearance-none transition-all duration-150 focus:outline-none ${
								!selectedCounty || isNationalList || isAllSelected
									? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
									: "bg-white border-slate-200 text-slate-900 cursor-pointer hover:border-brand/50 focus:border-brand focus:ring-4 focus:ring-brand/10"
							}`}
						>
							<option value="">{t("mps.filter.select_district")}</option>
							{currentCountyData?.districts.map((district) => (
								<option key={district} value={district}>
									{district}
								</option>
							))}
						</select>
						<div
							className={`pointer-events-none absolute right-3 bottom-3.5 transition-opacity ${
								!selectedCounty || isNationalList || isAllSelected ? "opacity-30" : ""
							}`}
						>
							<svg
								className="w-4 h-4 text-slate-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
				</div>

				{selectedCounty && (
					<p className="mt-4 text-sm text-slate-600 text-center">
						{t("mps.showing", { shown: filteredMps.length, total: sortedMps.length })}
					</p>
				)}

				{!selectedCounty && (
					<p className="mt-8 text-slate-500 text-center">
						{t("mps.filter.select_to_show")}
					</p>
				)}

				{selectedCounty && filteredMps.length > 0 && (
					<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredMps.map(({ slug, mp }) => (
							<MpCard
								key={slug}
								slug={slug}
								mp={mp}
								selectedCounty={selectedCounty}
								selectedDistrict={selectedDistrict}
							/>
						))}
					</div>
				)}

				{selectedCounty && filteredMps.length === 0 && (
					<p className="mt-8 text-slate-500 text-center">
						{t("mps.no_results")}
					</p>
				)}
			</div>
		</section>
	);
}
