import type { SyntheticEvent } from "react";
import type { JSX } from "react";
import { getLatestDistrictOrList, getLatestParty, type Mp, type MpId, mps, NATIONAL_LIST } from "../data/mps.ts";
import {
	ALL_OPTION,
	currentCountyData as currentCountyOptions,
	currentMinorityListMps,
	currentMps,
	parseDistrict,
} from "../islands/mps-section.tsx";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { MpSelectCard } from "./mp-select-card.tsx";
import { GroupSelectCard } from "./group-select-card.tsx";
import { MpImage } from "./mp-image.tsx";
import { VoteBadge } from "./vote-badge.tsx";
import { Label, SearchInput, Select, SelectWrapper } from "./form.tsx";
import { ExternalLink } from "./external-link.tsx";

// Default value for including lists (user must opt-in)
const DEFAULT_INCLUDE = false;
const HAS_CURRENT_MINORITY_LIST = currentMinorityListMps.length > 0;
const SELECTED_CARDS_GRID_CLASS = "grid grid-cols-1 md:grid-cols-3 gap-4";

function CheckIcon(): JSX.Element {
	return (
		<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
		</svg>
	);
}

interface SelectedMpCardProps {
	mpId: MpId;
	mp: Mp;
	lang: SupportedLanguage;
	onDeselect: () => void;
}

function SelectedMpCard({ mp, lang, onDeselect }: SelectedMpCardProps): JSX.Element {
	const currentParty = getLatestParty(mp);
	const currentDistrictOrList = getLatestDistrictOrList(mp);

	return (
		<button
			type="button"
			onClick={onDeselect}
			className="relative bg-slate-50 rounded-xl p-4 border-2 border-brand ring-2 ring-brand/20 w-full text-left hover:bg-slate-100 transition-colors cursor-pointer"
		>
			<div className="absolute top-2 right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
				<CheckIcon />
			</div>

			<div className="flex items-center gap-3">
				<MpImage slug={mp.slug} name={mp.name} hasImage={!!mp.imageUrl} size="sm" className="shrink-0" />
				<div className="min-w-0 flex-1">
					<h4 className="font-medium text-slate-900 truncate">{mp.name}</h4>
					{currentParty && (
						<p className="text-sm text-slate-500 truncate">
							{t(`mps.party.${currentParty}`, lang, { defaultValue: currentParty })}
						</p>
					)}
					{currentDistrictOrList && <p className="text-sm text-slate-400 truncate">{currentDistrictOrList}</p>}
				</div>
			</div>

			<div className="mt-3">
				<VoteBadge vote={mp.vote} lang={lang} />
			</div>
		</button>
	);
}

interface MpSelectorProps {
	selectedRep: [string, (value: string) => void];
	selectedCounty: [string, (value: string) => void];
	selectedDistrict: [string, (value: string) => void];
	searchQuery: [string, (value: string) => void];
	includeMinorityList: [boolean, (value: boolean) => void];
	lang: SupportedLanguage;
}

export function MpSelector(props: MpSelectorProps): JSX.Element {
	const {
		selectedRep: [selectedRep, setSelectedRep],
		selectedCounty: [selectedCounty, setSelectedCounty],
		selectedDistrict: [selectedDistrict, setSelectedDistrict],
		searchQuery: [searchQuery, setSearchQuery],
		includeMinorityList: [includeMinorityList, setIncludeMinorityList],
		lang,
	} = props;

	const selectedCountyData = currentCountyOptions.find((county) => county.name === selectedCounty);
	const isAllSelected = selectedCounty === ALL_OPTION;
	const isNationalListSelected = selectedCountyData?.isNationalList ?? false;

	// Filter MPs based on county/list, district, and search query (AND logic).
	const filteredMps = currentMps.filter(({ mp }: { mp: Mp }) => {
		const parsed = parseDistrict(getLatestDistrictOrList(mp) ?? undefined);
		if (!parsed) return false;

		// Name search filter (always AND with county if both are set)
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			if (!mp.name.toLowerCase().includes(query)) {
				return false;
			}
		}

		if (!selectedCounty && searchQuery) return true;
		if (isAllSelected) return true;
		if (!selectedCounty) return false;

		if (isNationalListSelected) {
			return parsed.county === selectedCounty;
		}

		if (parsed.county !== selectedCounty) return false;

		if (selectedDistrict && parsed.districtNum !== selectedDistrict) {
			return false;
		}

		// If no filters are set, show nothing (require at least a search or county)
		if (!selectedCounty && !searchQuery) return false;

		return true;
	});

	function clearSelectedRep(): void {
		setSelectedRep("");
		setIncludeMinorityList(DEFAULT_INCLUDE);
	}

	function deselectMp(): void {
		clearSelectedRep();
		setSelectedDistrict("");
	}

	function handleCountyChange(e: SyntheticEvent): void {
		setSelectedCounty((e.target as HTMLSelectElement).value);
		setSelectedDistrict("");
		clearSelectedRep();
	}

	function handleDistrictChange(e: SyntheticEvent): void {
		const district = (e.target as HTMLSelectElement).value;
		setSelectedDistrict(district);
		clearSelectedRep();

		// Auto-select the MP for this district
		if (district && selectedCounty) {
			const mpEntry = currentMps.find(({ mp }: { mp: Mp }) => {
				const parsed = parseDistrict(getLatestDistrictOrList(mp) ?? undefined);
				return parsed && !parsed.isNationalList && parsed.county === selectedCounty && parsed.districtNum === district;
			});
			if (mpEntry) {
				setSelectedRep(mpEntry.mpId);
			}
		}
	}

	function handleSearchInput(e: SyntheticEvent): void {
		setSearchQuery((e.target as HTMLInputElement).value);
	}

	function selectMp(mpId: MpId): void {
		// If already selected, deselect
		if (selectedRep === mpId) {
			deselectMp();
			return;
		}

		// Select the new representative
		setSelectedRep(mpId);
		setIncludeMinorityList(DEFAULT_INCLUDE);

		// Auto-fill county and district from the selected MP
		const mp = mps[mpId];
		const currentDistrictOrList = mp ? getLatestDistrictOrList(mp) : null;
		if (currentDistrictOrList) {
			const parsed = parseDistrict(currentDistrictOrList);
			if (parsed) {
				setSelectedCounty(parsed.county);
				setSelectedDistrict(parsed.districtNum ?? "");
			}
		}
	}

	function handleToggleMinority(): void {
		setIncludeMinorityList(!includeMinorityList);
	}

	const districtDisabled = !selectedCounty || isNationalListSelected || isAllSelected;
	const selectedRepId = selectedRep;
	const selectedMp = selectedRepId ? mps[selectedRepId] : null;
	const minorityListAdditionalCount = currentMinorityListMps.filter(({ mpId }) => mpId !== selectedRepId).length;

	return (
		<div>
			{/* Filters - Row 1: County + District */}
			<div id="action-filters" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 scroll-mt-24">
				{/* County dropdown */}
				<div>
					<Label htmlFor="action-county-select" uppercase>
						{t("mps.filter.county", lang)}
					</Label>
					<SelectWrapper>
						<Select id="action-county-select" value={selectedCounty} onChange={handleCountyChange}>
							<option value="">{t("mps.filter.select_county", lang)}</option>
							<option value={ALL_OPTION}>{t("mps.filter.all", lang)}</option>
							{currentCountyOptions.map((county) => (
								<option key={county.name} value={county.name}>
									{county.isNationalList
										? t(`mps.filter.${county.name === NATIONAL_LIST ? "national_list" : "minority_list"}`, lang)
										: county.name}
								</option>
							))}
						</Select>
					</SelectWrapper>
				</div>

				{/* District dropdown */}
				<div>
					<Label htmlFor="action-district-select" uppercase disabled={districtDisabled}>
						{t("mps.filter.district", lang)}
					</Label>
					<SelectWrapper disabled={districtDisabled}>
						<Select
							id="action-district-select"
							value={selectedDistrict}
							disabled={districtDisabled}
							onChange={handleDistrictChange}
						>
							<option value="">{t("mps.filter.select_district", lang)}</option>
							{selectedCountyData?.districts.map((district) => (
								<option key={district} value={district}>
									{district}
								</option>
							))}
						</Select>
					</SelectWrapper>
				</div>
			</div>

			{/* Filters - Row 2: Name search */}
			<div className="mb-4">
				<Label htmlFor="action-search" uppercase>
					{t("action.search_placeholder", lang)}
				</Label>
				<SearchInput
					id="action-search"
					value={searchQuery}
					onChange={handleSearchInput}
					placeholder={t("action.search_placeholder", lang)}
				/>
			</div>

			{/* District lookup hint */}
			<p className="text-sm text-slate-500 mb-4">
				{t("mps.district_lookup_hint", lang)}{" "}
				<ExternalLink href="https://vtr.valasztas.hu/ogy2026/egyeni-valasztokeruletek" className="underline">
					valasztas.hu
				</ExternalLink>
			</p>

			{/* Selected MP + Group cards (when MP is selected) */}
			{selectedRepId && selectedMp && (
				<div id="action-selected-cards" className={SELECTED_CARDS_GRID_CLASS}>
					<SelectedMpCard mpId={selectedRepId} mp={selectedMp} lang={lang} onDeselect={() => deselectMp()} />

					{HAS_CURRENT_MINORITY_LIST && (
						<GroupSelectCard
							title={t("action.minority_list_title", lang)}
							subtitle={t("action.minority_list_subtitle", lang)}
							contactCount={`+${minorityListAdditionalCount}`}
							selected={includeMinorityList}
							onToggle={handleToggleMinority}
							colorVariant="silver"
							lang={lang}
						/>
					)}
				</div>
			)}

			{/* Warning when email list is too long */}
			{selectedRepId &&
				(() => {
					const emails = new Set([
						...(selectedMp?.emails ?? []),
						...(includeMinorityList
							? currentMinorityListMps.flatMap(({ mp }: { mp: Mp }) => Array.from(mp.emails))
							: []),
					]);
					return emails.size > 30 ? (
						<p className="mt-4 text-sm text-amber-600 font-medium">
							⚠️ {t("action.list_warning", lang, { count: emails.size })}
						</p>
					) : null;
				})()}

			{/* No filter selected message (only when no rep selected) */}
			{!selectedRepId && !selectedCounty && !searchQuery && (
				<p className="text-slate-400 text-center py-8">{t("action.select_prompt", lang)}</p>
			)}

			{/* MP grid (only when no rep selected and filters active) */}
			{!selectedRepId && (selectedCounty || searchQuery) && filteredMps.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredMps.map(({ mpId, mp }) => (
						<MpSelectCard
							key={mpId}
							slug={mp.slug}
							mp={mp}
							selected={selectedRepId === mpId}
							onToggle={() => selectMp(mpId)}
							lang={lang}
						/>
					))}
				</div>
			)}

			{/* No results message (only when no rep selected) */}
			{!selectedRepId && (selectedCounty || searchQuery) && filteredMps.length === 0 && (
				<p className="text-slate-400 text-center py-8">{t("mps.no_results", lang)}</p>
			)}
		</div>
	);
}
