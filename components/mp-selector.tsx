import type { JSX } from "preact";
import { type Signal, useComputed } from "@preact/signals";
import { type Mp, mps, type MpSlug } from "../data/mps.ts";
import {
	districtCountyData,
	minorityListMps,
	nationalListMps,
	parseDistrict,
	sortedMps,
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
	slug: MpSlug;
	mp: Mp;
	lang: SupportedLanguage;
}

function SelectedMpCard({ slug, mp, lang }: SelectedMpCardProps): JSX.Element {
	return (
		<div class="relative bg-slate-50 rounded-xl p-4 border-2 border-brand ring-2 ring-brand/20">
			<div class="absolute top-2 right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
				<CheckIcon />
			</div>

			<div class="flex items-center gap-3">
				<MpImage slug={slug} name={mp.name} size="sm" class="shrink-0" />
				<div class="min-w-0 flex-1">
					<h4 class="font-medium text-slate-900 truncate">{mp.name}</h4>
					<p class="text-sm text-slate-500 truncate">
						{t(`mps.party.${mp.party}`, lang, { defaultValue: mp.party })}
					</p>
					{mp.district && <p class="text-sm text-slate-400 truncate">{mp.district}</p>}
				</div>
			</div>

			<div class="mt-3">
				<VoteBadge vote={mp.vote} lang={lang} />
			</div>
		</div>
	);
}

interface MpSelectorProps {
	selectedRep: Signal<MpSlug | null>;
	selectedCounty: Signal<string>;
	selectedDistrict: Signal<string>;
	searchQuery: Signal<string>;
	includeNationalList: Signal<boolean>;
	includeMinorityList: Signal<boolean>;
	lang: SupportedLanguage;
}

export function MpSelector(props: MpSelectorProps): JSX.Element {
	const {
		selectedRep,
		selectedCounty,
		selectedDistrict,
		searchQuery,
		includeNationalList,
		includeMinorityList,
		lang,
	} = props;

	const currentCountyData = useComputed(() => districtCountyData.find((c) => c.name === selectedCounty.value));

	// Filter MPs based on county, district, and search query (AND logic)
	const filteredMps = useComputed(() => {
		return sortedMps.filter(({ mp }) => {
			const parsed = parseDistrict(mp.district);
			if (!parsed) return false;

			// Exclude national list MPs from the selection grid
			if (parsed.isNationalList) return false;

			// Name search filter (always AND with county if both are set)
			if (searchQuery.value) {
				const query = searchQuery.value.toLowerCase();
				if (!mp.name.toLowerCase().includes(query)) {
					return false;
				}
			}

			// County filter
			if (selectedCounty.value) {
				if (parsed.county !== selectedCounty.value) return false;

				// District filter (only if county is selected)
				if (selectedDistrict.value && parsed.districtNum !== selectedDistrict.value) {
					return false;
				}
			}

			// If no filters are set, show nothing (require at least a search or county)
			if (!selectedCounty.value && !searchQuery.value) {
				return false;
			}

			return true;
		});
	});

	function resetSelection(): void {
		selectedRep.value = null;
		includeNationalList.value = DEFAULT_INCLUDE;
		includeMinorityList.value = DEFAULT_INCLUDE;
	}

	function handleCountyChange(e: Event): void {
		selectedCounty.value = (e.target as HTMLSelectElement).value;
		selectedDistrict.value = "";
		resetSelection();
	}

	function handleDistrictChange(e: Event): void {
		const district = (e.target as HTMLSelectElement).value;
		selectedDistrict.value = district;
		resetSelection();

		// Auto-select the MP for this district
		if (district && selectedCounty.value) {
			const mpEntry = sortedMps.find(({ mp }) => {
				const parsed = parseDistrict(mp.district);
				return (
					parsed &&
					!parsed.isNationalList &&
					parsed.county === selectedCounty.value &&
					parsed.districtNum === district
				);
			});
			if (mpEntry) {
				selectedRep.value = mpEntry.slug;
			}
		}
	}

	function handleSearchInput(e: Event): void {
		searchQuery.value = (e.target as HTMLInputElement).value;
	}

	function selectMp(slug: MpSlug): void {
		// If already selected, deselect
		if (selectedRep.value === slug) {
			resetSelection();
			return;
		}

		// Select the new representative
		selectedRep.value = slug;
		includeNationalList.value = DEFAULT_INCLUDE;
		includeMinorityList.value = DEFAULT_INCLUDE;

		// Auto-fill county and district from the selected MP
		const mp = mps[slug];
		if (mp?.district) {
			const parsed = parseDistrict(mp.district);
			if (parsed && !parsed.isNationalList) {
				selectedCounty.value = parsed.county;
				selectedDistrict.value = parsed.districtNum ?? "";
			}
		}
	}

	function handleToggleNational(): void {
		includeNationalList.value = !includeNationalList.value;
	}

	function handleToggleMinority(): void {
		includeMinorityList.value = !includeMinorityList.value;
	}

	const districtDisabled = !selectedCounty.value;
	const selectedMp = selectedRep.value ? mps[selectedRep.value] : null;

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
							{districtCountyData.map((county) => (
								<option key={county.name} value={county.name}>
									{county.name}
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
							{currentCountyData.value?.districts.map((district) => (
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
					href="https://vtr.valasztas.hu/ogy2022/egyeni-valasztokeruletek"
					class="underline"
				>
					valasztas.hu
				</ExternalLink>
			</p>

			{/* List selection hint - always visible */}
			<p class="text-sm text-slate-500 mb-6">
				{t("action.list_selection_hint", lang)}
			</p>

			{/* Selected MP + Group cards (when MP is selected) */}
			{selectedRep.value && selectedMp && (
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<SelectedMpCard slug={selectedRep.value} mp={selectedMp} lang={lang} />

					<GroupSelectCard
						title={t("action.national_list_title", lang)}
						subtitle={t("action.national_list_subtitle", lang)}
						contactCount={nationalListMps.length}
						selected={includeNationalList.value}
						onToggle={handleToggleNational}
						colorVariant="gold"
						lang={lang}
					/>

					<GroupSelectCard
						title={t("action.minority_list_title", lang)}
						subtitle={t("action.minority_list_subtitle", lang)}
						contactCount={minorityListMps.length}
						selected={includeMinorityList.value}
						onToggle={handleToggleMinority}
						colorVariant="silver"
						lang={lang}
					/>
				</div>
			)}

			{/* Warning when email list is too long */}
			{selectedRep.value && (() => {
				const emails = new Set([
					...(selectedMp?.emails ?? []),
					...(includeNationalList.value ? nationalListMps.flatMap(({ mp }) => mp.emails) : []),
					...(includeMinorityList.value ? minorityListMps.flatMap(({ mp }) => mp.emails) : []),
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
			{!selectedRep.value && !selectedCounty.value && !searchQuery.value && (
				<p class="text-slate-400 text-center py-8">
					{t("action.select_prompt", lang)}
				</p>
			)}

			{/* MP grid (only when no rep selected and filters active) */}
			{!selectedRep.value &&
				(selectedCounty.value || searchQuery.value) &&
				filteredMps.value.length > 0 && (
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredMps.value.map(({ slug, mp }) => (
						<MpSelectCard
							key={slug}
							slug={slug}
							mp={mp}
							selected={selectedRep.value === slug}
							onToggle={() => selectMp(slug)}
							lang={lang}
						/>
					))}
				</div>
			)}

			{/* No results message (only when no rep selected) */}
			{!selectedRep.value &&
				(selectedCounty.value || searchQuery.value) &&
				filteredMps.value.length === 0 && (
				<p class="text-slate-400 text-center py-8">
					{t("mps.no_results", lang)}
				</p>
			)}
		</div>
	);
}
