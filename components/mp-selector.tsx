import type { JSX } from "preact";
import { type Signal, useComputed, useSignalEffect } from "@preact/signals";
import type { MpSlug } from "../data/mps.ts";
import { ALL_OPTION, countyData, NATIONAL_LIST, parseDistrict, sortedMps } from "../islands/mps-section.tsx";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { MpSelectCard } from "./mp-select-card.tsx";
import { Label, SearchInput, Select, SelectWrapper, Textarea } from "./form.tsx";

interface MpSelectorProps {
	selectedMps: Signal<Set<MpSlug>>;
	selectedCounty: Signal<string>;
	selectedDistrict: Signal<string>;
	searchQuery: Signal<string>;
	message: string;
	lang: SupportedLanguage;
}

export function MpSelector(props: MpSelectorProps): JSX.Element {
	const { selectedMps, selectedCounty, selectedDistrict, searchQuery, message, lang } = props;

	const isAllSelected = useComputed(() => selectedCounty.value === ALL_OPTION);
	const currentCountyData = useComputed(() => countyData.find((c) => c.name === selectedCounty.value));
	const isNationalList = useComputed(() => currentCountyData.value?.isNationalList ?? false);

	const filteredMps = useComputed(() => {
		return sortedMps.filter(({ mp }) => {
			// Name search filter (always applied)
			if (searchQuery.value) {
				const query = searchQuery.value.toLowerCase();
				if (!mp.name.toLowerCase().includes(query)) {
					return false;
				}
			}

			// If searching by name without county filter, show matches
			if (searchQuery.value && !selectedCounty.value) {
				return true;
			}

			// County/district filter
			if (isAllSelected.value) return true;
			if (!selectedCounty.value) return false;

			const parsed = parseDistrict(mp.district);
			if (!parsed) return false;

			if (isNationalList.value) {
				return parsed.county === selectedCounty.value;
			}

			if (parsed.county !== selectedCounty.value) return false;
			if (selectedDistrict.value && parsed.districtNum !== selectedDistrict.value) return false;

			return true;
		});
	});

	// Reset selection when filters change
	useSignalEffect(() => {
		// Track dependencies
		selectedCounty.value;
		selectedDistrict.value;
		searchQuery.value;
		// Reset selection
		selectedMps.value = new Set();
	});

	function handleCountyChange(e: Event): void {
		selectedCounty.value = (e.target as HTMLSelectElement).value;
		selectedDistrict.value = "";
	}

	function handleDistrictChange(e: Event): void {
		selectedDistrict.value = (e.target as HTMLSelectElement).value;
	}

	function handleSearchInput(e: Event): void {
		searchQuery.value = (e.target as HTMLInputElement).value;
	}

	function handleSelectAll(): void {
		selectedMps.value = new Set(filteredMps.value.map(({ slug }) => slug));
	}

	function handleDeselectAll(): void {
		selectedMps.value = new Set();
	}

	function toggleMp(slug: MpSlug): void {
		const newSet = new Set(selectedMps.value);
		if (newSet.has(slug)) {
			newSet.delete(slug);
		} else {
			newSet.add(slug);
		}
		selectedMps.value = newSet;
	}

	const districtDisabled = !selectedCounty.value || isNationalList.value || isAllSelected.value;

	return (
		<div>
			{/* Filters */}
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
							{countyData.map((county) => (
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
							{currentCountyData.value?.districts.map((district) => (
								<option key={district} value={district}>
									{district}
								</option>
							))}
						</Select>
					</SelectWrapper>
				</div>

				{/* Search input */}
				<div>
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
			</div>

			{/* Selection controls */}
			<div class="flex flex-wrap items-center gap-4 mb-6">
				<button
					type="button"
					onClick={handleSelectAll}
					disabled={filteredMps.value.length === 0}
					class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{t("action.select_all", lang)}
				</button>
				<button
					type="button"
					onClick={handleDeselectAll}
					disabled={selectedMps.value.size === 0}
					class="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{t("action.deselect_all", lang)}
				</button>
				<span class="text-slate-600 text-sm">
					{t("action.selected_of_total", lang, {
						selected: selectedMps.value.size.toString(),
						total: filteredMps.value.length.toString(),
					})}
				</span>
			</div>

			{/* No filter selected message */}
			{!selectedCounty.value && !searchQuery.value && (
				<p class="text-slate-400 text-center py-8">
					{t("mps.filter.select_to_show", lang)}
				</p>
			)}

			{/* MP grid */}
			{(selectedCounty.value || searchQuery.value) && filteredMps.value.length > 0 && (
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredMps.value.map(({ slug, mp }) => (
						<MpSelectCard
							key={slug}
							slug={slug}
							mp={mp}
							selected={selectedMps.value.has(slug)}
							onToggle={() => toggleMp(slug)}
							lang={lang}
						/>
					))}
				</div>
			)}

			{/* No results message */}
			{(selectedCounty.value || searchQuery.value) && filteredMps.value.length === 0 && (
				<p class="text-slate-400 text-center py-8">
					{t("mps.no_results", lang)}
				</p>
			)}

			{/* Message preview */}
			<div class="mt-8">
				<Label for="action-message-preview">{t("action.message_preview", lang)}</Label>
				<Textarea
					id="action-message-preview"
					value={message}
					disabled
					resizable={false}
				/>
			</div>
		</div>
	);
}
