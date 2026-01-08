import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import {
	formatPhoneForDisplay,
	type Mp,
	mps,
	type MpSlug,
	partyEmails,
	voteSource,
	type VoteType,
} from "../data/mps.ts";

const voteColors: Record<VoteType, { badge: string; border: string }> = {
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
	not_voted: {
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
	not_voted: 2,
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
				countyMap.get(parsed.county)!.add(parsed.districtNum);
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

interface MpCardProps {
	mp: Mp;
}

function DataRow({
	icon,
	children,
	isEmpty = false,
}: {
	icon: string;
	children: React.ReactNode;
	isEmpty?: boolean;
}): JSX.Element {
	return (
		<div className="flex items-start gap-2 text-sm">
			<span className="w-5 shrink-0 text-center opacity-60">{icon}</span>
			<span className={isEmpty ? "text-slate-300 font-mono" : ""}>{children}</span>
		</div>
	);
}

function MpCard({ mp }: MpCardProps): JSX.Element {
	const { t } = useTranslation();
	const colors = voteColors[mp.vote];
	const emails = Array.from(mp.emails);

	return (
		<div
			className={`relative bg-white rounded-lg border-2 ${colors.border} p-5 transition-all duration-200 hover:shadow-md`}
		>
			{/* Header: Photo + Name + Party */}
			<div className="flex items-start gap-4 mb-4">
				{mp.imageUrl
					? (
						<img
							src={mp.imageUrl}
							alt={mp.name}
							className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shrink-0"
						/>
					)
					: (
						<div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200 shrink-0">
							<span className="text-slate-400 text-xl">👤</span>
						</div>
					)}
				<div className="min-w-0 flex-1 pt-1">
					<h3 className="font-semibold text-slate-900 leading-tight">{mp.name}</h3>
					<p className="text-sm text-slate-500">{t(`mps.party.${mp.party}`, mp.party)}</p>
				</div>
				<span
					className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${colors.badge}`}
				>
					{t(`mps.vote.${mp.vote}`)}
				</span>
			</div>

			{/* Data rows */}
			<div className="space-y-1.5 text-slate-600">
				{mp.district && (
					<DataRow icon="📍">
						<span className="text-slate-700">{mp.district}</span>
					</DataRow>
				)}

				{/* Website - always show */}
				<DataRow icon="🌐" isEmpty={!mp.website}>
					{mp.website
						? (
							<a
								href={mp.website}
								target="_blank"
								rel="noopener noreferrer"
								className="font-mono text-sm text-brand hover:text-brand-hover transition-colors break-all"
							>
								{mp.website.replace(/^https?:\/\//, "")}
							</a>
						)
						: "–"}
				</DataRow>

				{/* Emails */}
				{emails.map((email) => (
					<DataRow key={email} icon="📧">
						<a
							href={`mailto:${email}`}
							className="font-mono text-sm text-brand hover:text-brand-hover transition-colors break-all"
						>
							{email}
						</a>
					</DataRow>
				))}

				{/* Phones */}
				{mp.phones.size > 0
					? Array.from(mp.phones).map((phone) => (
						<DataRow key={phone} icon="📞">
							<a
								href={`tel:+${phone}`}
								className="font-mono text-sm text-brand hover:text-brand-hover transition-colors"
							>
								{formatPhoneForDisplay(phone)}
							</a>
						</DataRow>
					))
					: (
						<DataRow icon="📞" isEmpty>
							–
						</DataRow>
					)}
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
	const { t } = useTranslation();

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
				<h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
					{t("mps.title")}
				</h2>
				<p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
					{t("mps.description")}
				</p>

				<div className="mt-8 p-4 bg-white rounded-lg border border-slate-200 space-y-2">
					<p className="text-sm text-slate-600">
						<strong>{t("mps.source")}:</strong>{" "}
						<a
							href={voteSource.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-brand hover:text-brand-hover transition-colors underline"
						>
							{voteSource.label}
						</a>
						{" | "}
						<a
							href={mpListSource.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-brand hover:text-brand-hover transition-colors underline"
						>
							{t("mps.mp_list_source")}
						</a>
					</p>
					<p className="text-sm text-slate-500">
						{t("mps.district_lookup_hint")}{" "}
						<a
							href="https://vtr.valasztas.hu/ogy2022/egyeni-valasztokeruletek"
							target="_blank"
							rel="noopener noreferrer"
							className="text-brand hover:text-brand-hover transition-colors underline"
						>
							valasztas.hu
						</a>
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
						{filteredMps.map(({ slug, mp }) => <MpCard key={slug} mp={mp} />)}
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
