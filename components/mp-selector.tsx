import type { JSX } from "preact";
import { type Signal, useComputed } from "@preact/signals";
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
		<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={3}
				d="M5 13l4 4L19 7"
			/>
		</svg>
	);
}

interface SelectedMpCardProps {
	mpId: MpId;
	mp: Mp;
	lang: SupportedLanguage;
	onDeselect: () => void;
}

function SelectedMpCard({ mpId: _, mp, lang, onDeselect }: SelectedMpCardProps): JSX.Element {
	const currentParty = getLatestParty(mp);
	const currentDistrictOrList = getLatestDistrictOrList(mp);

	return (
		<button
			type="button"
			onClick={onDeselect}
			class="relative bg-slate-50 rounded-xl p-4 border-2 border-brand ring-2 ring-brand/20 w-full text-left hover:bg-slate-100 transition-colors cursor-pointer"
		>
			<div class="absolute top-2 right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
				<CheckIcon />
			</div>

			<div class="flex items-center gap-3">
				<MpImage slug={mp.slug} name={mp.name} hasImage={!!mp.imageUrl} size="sm" class="shrink-0" />
				<div class="min-w-0 flex-1">
					<h4 class="font-medium text-slate-900 truncate">{mp.name}</h4>
					{currentParty && (
						<p class="text-sm text-slate-500 truncate">
							{t(`mps.party.${currentParty}`, lang, { defaultValue: currentParty })}
						</p>
					)}
					{currentDistrictOrList && <p class="text-sm text-slate-400 truncate">{currentDistrictOrList}</p>}
				</div>
			</div>

			<div class="mt-3">
				<VoteBadge vote={mp.vote} lang={lang} />
			</div>
		</button>
	);
}

interface MpSelectorProps {
	selectedRep: Signal<MpId | null>;
	selectedCounty: Signal<string>;
	selectedDistrict: Signal<string>;
	searchQuery: Signal<string>;
	includeMinorityList: Signal<boolean>;
	lang: SupportedLanguage;
}

export function MpSelector(props: MpSelectorProps): JSX.Element {
	const {
		selectedRep,
		selectedCounty,
		selectedDistrict,
		searchQuery,
		includeMinorityList,
		lang,
	} = props;

	const selectedCountyData = useComputed(() =>
		currentCountyOptions.find((county: { name: string }) => county.name === selectedCounty.value)
	);
	const isAllSelected = useComputed(() => selectedCounty.value === ALL_OPTION);
	const isNationalListSelected = useComputed(() => selectedCountyData.value?.isNationalList ?? false);

	// Filter MPs based on county/list, district, and search query (AND logic).
	const filteredMps = useComputed(() => {
		return currentMps.filter(({ mp }: { mp: Mp }) => {
			const parsed = parseDistrict(getLatestDistrictOrList(mp) ?? undefined);
			if (!parsed) return false;

			// Name search filter (always AND with county if both are set)
			if (searchQuery.value) {
				const query = searchQuery.value.toLowerCase();
				if (!mp.name.toLowerCase().includes(query)) {
					return false;
				}
			}

			if (!selectedCounty.value && searchQuery.value) return true;
			if (isAllSelected.value) return true;
			if (!selectedCounty.value) return false;

			if (isNationalListSelected.value) {
				return parsed.county === selectedCounty.value;
			}

			if (parsed.county !== selectedCounty.value) return false;

			if (selectedDistrict.value && parsed.districtNum !== selectedDistrict.value) {
				return false;
			}

			// If no filters are set, show nothing (require at least a search or county)
			if (!selectedCounty.value && !searchQuery.value) return false;

			return true;
		});
	});

	function clearSelectedRep(): void {
		selectedRep.value = null;
		includeMinorityList.value = DEFAULT_INCLUDE;
	}

	function deselectMp(): void {
		clearSelectedRep();
		selectedDistrict.value = "";
	}

	function handleCountyChange(e: Event): void {
		selectedCounty.value = (e.target as HTMLSelectElement).value;
		selectedDistrict.value = "";
		clearSelectedRep();
	}

	function handleDistrictChange(e: Event): void {
		const district = (e.target as HTMLSelectElement).value;
		selectedDistrict.value = district;
		clearSelectedRep();

		// Auto-select the MP for this district
		if (district && selectedCounty.value) {
			const mpEntry = currentMps.find(({ mp }: { mp: Mp }) => {
				const parsed = parseDistrict(getLatestDistrictOrList(mp) ?? undefined);
				return (
					parsed &&
					!parsed.isNationalList &&
					parsed.county === selectedCounty.value &&
					parsed.districtNum === district
				);
			});
			if (mpEntry) {
				selectedRep.value = mpEntry.mpId;
			}
		}
	}

	function handleSearchInput(e: Event): void {
		searchQuery.value = (e.target as HTMLInputElement).value;
	}

	function selectMp(mpId: MpId): void {
		// If already selected, deselect
		if (selectedRep.value === mpId) {
			deselectMp();
			return;
		}

		// Select the new representative
		selectedRep.value = mpId;
		includeMinorityList.value = DEFAULT_INCLUDE;

		// Auto-fill county and district from the selected MP
		const mp = mps[mpId];
		const currentDistrictOrList = mp ? getLatestDistrictOrList(mp) : null;
		if (currentDistrictOrList) {
			const parsed = parseDistrict(currentDistrictOrList);
			if (parsed) {
				selectedCounty.value = parsed.county;
				selectedDistrict.value = parsed.districtNum ?? "";
			}
		}
	}

	function handleToggleMinority(): void {
		includeMinorityList.value = !includeMinorityList.value;
	}

	const districtDisabled = !selectedCounty.value || isNationalListSelected.value || isAllSelected.value;
	const selectedRepId = selectedRep.value;
	const selectedMp = selectedRepId ? mps[selectedRepId] : null;
	const minorityListAdditionalCount = currentMinorityListMps.filter(({ mpId }) => mpId !== selectedRepId).length;

	return (
		<div>
			{/* Filters - Row 1: County + District */}
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
				{/* County dropdown */}
				<div>
					<Label for="action-county-select" uppercase>
						{t("mps.filter.county", lang)}
					</Label>
					<SelectWrapper>
						<Select
							id="action-county-select"
							value={selectedCounty.value}
							onChange={handleCountyChange}
						>
							<option value="">{t("mps.filter.select_county", lang)}</option>
							<option value={ALL_OPTION}>{t("mps.filter.all", lang)}</option>
							{currentCountyOptions.map((county) => (
								<option key={county.name} value={county.name}>
									{county.isNationalList
										? t(
											`mps.filter.${
												county.name === NATIONAL_LIST ? "national_list" : "minority_list"
											}`,
											lang,
										)
										: county.name}
								</option>
							))}
						</Select>
					</SelectWrapper>
				</div>

				{/* District dropdown */}
				<div>
					<Label for="action-district-select" uppercase disabled={districtDisabled}>
						{t("mps.filter.district", lang)}
					</Label>
					<SelectWrapper disabled={districtDisabled}>
						<Select
							id="action-district-select"
							value={selectedDistrict.value}
							disabled={districtDisabled}
							onChange={handleDistrictChange}
						>
							<option value="">{t("mps.filter.select_district", lang)}</option>
							{selectedCountyData.value?.districts.map((district) => (
								<option key={district} value={district}>
									{district}
								</option>
							))}
						</Select>
					</SelectWrapper>
				</div>
			</div>

			{/* Filters - Row 2: Name search */}
			<div class="mb-4">
				<Label for="action-search" uppercase>
					{t("action.search_placeholder", lang)}
				</Label>
				<SearchInput
					id="action-search"
					value={searchQuery.value}
					onInput={handleSearchInput}
					placeholder={t("action.search_placeholder", lang)}
				/>
			</div>

			{/* District lookup hint */}
			<p class="text-sm text-slate-500 mb-4">
				{t("mps.district_lookup_hint", lang)}{" "}
				<ExternalLink
					href="https://vtr.valasztas.hu/ogy2026/egyeni-valasztokeruletek"
					class="underline"
				>
					valasztas.hu
				</ExternalLink>
			</p>

			{/* Selected MP + Group cards (when MP is selected) */}
			{selectedRepId && selectedMp && (
				<div class={SELECTED_CARDS_GRID_CLASS}>
					<SelectedMpCard
						mpId={selectedRepId}
						mp={selectedMp}
						lang={lang}
						onDeselect={() => deselectMp()}
					/>

					{HAS_CURRENT_MINORITY_LIST && (
						<GroupSelectCard
							title={t("action.minority_list_title", lang)}
							subtitle={t("action.minority_list_subtitle", lang)}
							contactCount={`+${minorityListAdditionalCount}`}
							selected={includeMinorityList.value}
							onToggle={handleToggleMinority}
							colorVariant="silver"
							lang={lang}
						/>
					)}
				</div>
			)}

			{/* Warning when email list is too long */}
			{selectedRepId && (() => {
				const emails = new Set([
					...(selectedMp?.emails ?? []),
					...(includeMinorityList.value
						? currentMinorityListMps.flatMap(({ mp }: { mp: Mp }) => Array.from(mp.emails))
						: []),
				]);
				return emails.size > 30
					? (
						<p class="mt-4 text-sm text-amber-600 font-medium">
							⚠️ {t("action.list_warning", lang, { count: emails.size })}
						</p>
					)
					: null;
			})()}

			{/* No filter selected message (only when no rep selected) */}
			{!selectedRepId && !selectedCounty.value && !searchQuery.value && (
				<p class="text-slate-400 text-center py-8">
					{t("action.select_prompt", lang)}
				</p>
			)}

			{/* MP grid (only when no rep selected and filters active) */}
			{!selectedRepId &&
				(selectedCounty.value || searchQuery.value) &&
				filteredMps.value.length > 0 && (
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredMps.value.map(({ mpId, mp }) => (
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
			{!selectedRepId &&
				(selectedCounty.value || searchQuery.value) &&
				filteredMps.value.length === 0 && (
				<p class="text-slate-400 text-center py-8">
					{t("mps.no_results", lang)}
				</p>
			)}
		</div>
	);
}
