import type { SyntheticEvent } from "react";
import type { JSX } from "react";
import { useState } from "react";
import {
	getLatestMandate,
	getMandateForYear,
	getMandateLabel,
	isCurrentMp,
	MINORITY_LIST,
	type Mp,
	type MpId,
	type MpMandate,
	mps,
	NATIONAL_LIST,
	type VoteType,
} from "../data/mps.ts";
import { sources } from "../data/sources.ts";
import { useStringQueryParam } from "../hooks/use-root-query-params.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { ExternalLink } from "./external-link.tsx";
import { SearchInput } from "./form.tsx";
import { H2 } from "./h2.tsx";
import { MpImage } from "./mp-image.tsx";
import { voteColors } from "./vote-badge.tsx";
import { buildMailtoUrl } from "../utils/mailto.ts";

const votePriority: Record<VoteType, number> = {
	yes: 0,
	not_voted: 1,
	abstain: 2,
	not_in_parliament: 3,
	absent: 4,
	no: 5,
	banned: 6,
};

export const ALL_OPTION = "__osszes__";

export type ParsedDistrict = {
	county: string;
	districtNum: string | null;
	isNationalList: boolean;
};

export function parseDistrict(district: string | undefined): ParsedDistrict | null {
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

export type CountyData = {
	name: string;
	districts: string[];
	isNationalList: boolean;
};

type MpsSectionEntry = {
	mpId: MpId;
	mp: Mp;
	mandate: MpMandate;
};

function getSectionMandate(mp: Mp, electionYear?: number): MpMandate | null {
	return electionYear !== undefined ? getMandateForYear(mp, electionYear) : getLatestMandate(mp);
}

function buildCountyData(entries: MpsSectionEntry[]): CountyData[] {
	const countyMap = new Map<string, Set<string>>();
	const nationalLists: string[] = [];

	for (const { mandate } of entries) {
		const parsed = parseDistrict(getMandateLabel(mandate));
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

function getMpsByList(listName: string, entries: MpsSectionEntry[]): MpsSectionEntry[] {
	return entries.filter(({ mandate }) => getMandateLabel(mandate) === listName);
}

function getSortedMps(electionYear?: number): MpsSectionEntry[] {
	const entries = Object.entries(mps) as Array<[MpId, Mp]>;

	return entries
		.map(([mpId, mp]) => {
			const mandate = getSectionMandate(mp, electionYear);
			return mandate ? { mpId, mp, mandate } : null;
		})
		.filter((entry): entry is MpsSectionEntry => entry !== null)
		.sort((a, b) => {
			const priorityDiff = votePriority[a.mp.vote] - votePriority[b.mp.vote];
			if (priorityDiff !== 0) return priorityDiff;
			return a.mp.name.localeCompare(b.mp.name, "hu");
		});
}

export const sortedMps = getSortedMps();
export const countyData = buildCountyData(sortedMps);

// County data filtered to only include districts (no national lists)
export const districtCountyData = countyData.filter((c) => !c.isNationalList);

// Get MPs from national lists for group selection cards
export const nationalListMps = getMpsByList(NATIONAL_LIST, sortedMps);
export const minorityListMps = getMpsByList(MINORITY_LIST, sortedMps);

// Current (2026) MP exports - filtered to only include MPs elected in 2026
export const currentMps = sortedMps.filter(({ mp }) => isCurrentMp(mp));
export const currentCountyData = buildCountyData(currentMps);
export const currentDistrictCountyData = currentCountyData.filter((c) => !c.isNationalList);
export const currentNationalListMps = getMpsByList(NATIONAL_LIST, currentMps);
export const currentMinorityListMps = getMpsByList(MINORITY_LIST, currentMps);

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

interface MpCardProps {
	mpId: MpId;
	mp: Mp;
	mandate: MpMandate;
	lang: SupportedLanguage;
}

function MpCard({ mp, mandate, lang }: MpCardProps): JSX.Element {
	const colors = voteColors[mp.vote];
	const mailtoUrl = mp.emails.size > 0 ? buildMailtoUrl({ to: Array.from(mp.emails) }) : null;
	const firstPhone = mp.phones.size > 0 ? Array.from(mp.phones)[0] : null;
	const currentParty = mandate.party;
	const currentDistrictOrList = getMandateLabel(mandate);

	return (
		<div
			className={`relative bg-white rounded-xl border-2 ${colors.border} p-5 transition-all duration-200 hover:shadow-md flex flex-col`}
		>
			{/* Vote Badge - Top Right */}
			<span className={`absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full ${colors.badge}`}>
				{t(`mps.vote.${mp.vote}`, lang)}
			</span>

			{/* Photo */}
			<div className="flex justify-center mb-4">
				<MpImage slug={mp.slug} name={mp.name} hasImage={!!mp.imageUrl} size="sm" />
			</div>

			{/* Content */}
			<div className="flex-1 space-y-1 text-center">
				<h3 className="font-bold text-slate-900 text-lg leading-tight">{mp.name}</h3>
				{currentParty && (
					<p className="text-sm text-slate-500">
						{t(`mps.party.${currentParty}`, lang, { defaultValue: currentParty })}
					</p>
				)}
				{currentDistrictOrList && <p className="text-sm text-slate-600">{currentDistrictOrList}</p>}
			</div>

			{/* Button Row */}
			<div className="flex gap-2 mt-4">
				{mailtoUrl ? (
					<a
						href={mailtoUrl}
						className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
					>
						<EmailIcon />
						{t("mps.email", lang)}
					</a>
				) : (
					<span className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
						<EmailIcon />
						{t("mps.email", lang)}
					</span>
				)}
				{firstPhone ? (
					<a
						href={`tel:+${firstPhone}`}
						className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-hover transition-colors"
					>
						<PhoneIcon />
						{t("mps.phone", lang)}
					</a>
				) : (
					<span className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
						<PhoneIcon />
						{t("mps.phone", lang)}
					</span>
				)}
			</div>
		</div>
	);
}

const mpListSource = {
	url: "https://www.parlament.hu/web/guest/aktiv-kepviseloi-nevsor",
};

const historicalMpListSource = {
	url: "https://vtr.valasztas.hu/ogy2022",
};

export interface MpsSectionProps {
	lang: SupportedLanguage;
	selectedCounty: string;
	selectedDistrict: string;
	electionYear?: number;
	sectionId?: string;
	showHeading?: boolean;
}

export default function MpsSection(props: MpsSectionProps): JSX.Element {
	const { lang, electionYear, sectionId = "kepviselok", showHeading = true } = props;
	const [selectedCounty, setSelectedCounty] = useStringQueryParam({
		key: "megye",
		defaultValue: electionYear === 2022 ? ALL_OPTION : "",
		initialValue: props.selectedCounty,
	});
	const [selectedDistrict, setSelectedDistrict] = useStringQueryParam({
		key: "kerulet",
		defaultValue: "",
		initialValue: props.selectedDistrict,
	});
	const [searchQuery, setSearchQuery] = useState("");
	const voteSource = sources["parlament-szavazas-11922"];
	const sectionMps = electionYear !== undefined ? getSortedMps(electionYear) : sortedMps;
	const sectionCountyData = electionYear !== undefined ? buildCountyData(sectionMps) : countyData;
	const mpDirectorySource = electionYear === 2022 ? historicalMpListSource : mpListSource;

	const isAllSelected = selectedCounty === ALL_OPTION;
	const currentCountyData = sectionCountyData.find((c) => c.name === selectedCounty);
	const isNationalList = currentCountyData?.isNationalList ?? false;

	const filteredMps = sectionMps.filter(({ mp, mandate }) => {
		// Name search filter (always applied if set)
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			if (!mp.name.toLowerCase().includes(query)) {
				return false;
			}
		}

		// If only search query is set (no county), show matching results
		if (!selectedCounty && searchQuery) {
			return true;
		}

		if (isAllSelected) return true;
		if (!selectedCounty) return false;

		const parsed = parseDistrict(getMandateLabel(mandate));
		if (!parsed) return false;

		if (isNationalList) {
			return parsed.county === selectedCounty;
		}

		if (parsed.county !== selectedCounty) return false;
		if (selectedDistrict && parsed.districtNum !== selectedDistrict) return false;

		return true;
	});

	function handleCountyChange(e: SyntheticEvent): void {
		setSelectedCounty((e.target as HTMLSelectElement).value);
		setSelectedDistrict("");
	}

	function handleDistrictChange(e: SyntheticEvent): void {
		setSelectedDistrict((e.target as HTMLSelectElement).value);
	}

	function handleSearchInput(e: SyntheticEvent): void {
		setSearchQuery((e.target as HTMLInputElement).value);
	}

	return (
		<section id={sectionId} className="bg-slate-50 py-16 sm:py-20">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				{showHeading && (
					<>
						<H2>{t("mps.title", lang)}</H2>
						<p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">{t("mps.description", lang)}</p>
					</>
				)}

				<div className={`${showHeading ? "mt-8 " : ""}p-4 bg-white rounded-lg border border-slate-200`}>
					<p className="text-sm text-slate-600">
						<strong>{t("mps.source", lang)}:</strong>{" "}
						{voteSource.originalUrl ? (
							<ExternalLink href={voteSource.originalUrl} className="underline">
								{voteSource.title[lang]}
							</ExternalLink>
						) : (
							<span>{voteSource.title[lang]}</span>
						)}
						{" | "}
						<ExternalLink href={mpDirectorySource.url} className="underline">
							{electionYear === 2022 ? t("mps.election_source_2022", lang) : t("mps.mp_list_source", lang)}
						</ExternalLink>
					</p>
				</div>

				<div className="mt-6 grid grid-cols-2 gap-3">
					<div className="relative">
						<label
							htmlFor="mp-county-select"
							className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
						>
							{t("mps.filter.county", lang)}
						</label>
						<select
							id="mp-county-select"
							value={selectedCounty}
							onChange={handleCountyChange}
							className="w-full h-11 pl-3 pr-8 bg-white border-2 border-slate-200 rounded-md text-sm text-slate-900 font-medium appearance-none cursor-pointer transition-all duration-150 hover:border-brand/50 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
						>
							<option value="">{t("mps.filter.select_county", lang)}</option>
							<option value={ALL_OPTION}>{t("mps.filter.all", lang)}</option>
							{sectionCountyData.map((county) => (
								<option key={county.name} value={county.name}>
									{county.isNationalList
										? t(`mps.filter.${county.name === NATIONAL_LIST ? "national_list" : "minority_list"}`, lang)
										: county.name}
								</option>
							))}
						</select>
						<div className="pointer-events-none absolute right-3 bottom-3.5">
							<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
							{t("mps.filter.district", lang)}
						</label>
						<select
							id="mp-district-select"
							value={selectedDistrict}
							disabled={!selectedCounty || isNationalList || isAllSelected}
							onChange={handleDistrictChange}
							className={`w-full h-11 pl-3 pr-8 border-2 rounded-md text-sm font-medium appearance-none transition-all duration-150 focus:outline-none ${
								!selectedCounty || isNationalList || isAllSelected
									? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
									: "bg-white border-slate-200 text-slate-900 cursor-pointer hover:border-brand/50 focus:border-brand focus:ring-4 focus:ring-brand/10"
							}`}
						>
							<option value="">{t("mps.filter.select_district", lang)}</option>
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
							<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
				</div>

				<div className="mt-3">
					<SearchInput
						id="mp-search"
						value={searchQuery}
						onChange={handleSearchInput}
						placeholder={t("mps.search_placeholder", lang)}
					/>
				</div>

				{(selectedCounty || searchQuery) && (
					<p className="mt-4 text-sm text-slate-600 text-center">
						{t("mps.showing", lang, {
							shown: filteredMps.length.toString(),
							total: sectionMps.length.toString(),
						})}
					</p>
				)}

				{!selectedCounty && !searchQuery && (
					<p className="mt-8 text-slate-500 text-center">{t("mps.filter.select_to_show", lang)}</p>
				)}

				{(selectedCounty || searchQuery) && filteredMps.length > 0 && (
					<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredMps.map(({ mpId, mp, mandate }) => (
							<MpCard key={mpId} mpId={mpId} mp={mp} mandate={mandate} lang={lang} />
						))}
					</div>
				)}

				{(selectedCounty || searchQuery) && filteredMps.length === 0 && (
					<p className="mt-8 text-slate-500 text-center">{t("mps.no_results", lang)}</p>
				)}
			</div>
		</section>
	);
}
