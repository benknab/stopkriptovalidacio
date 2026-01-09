import type { JSX } from "preact";
import { type Signal, useComputed, useSignalEffect } from "@preact/signals";
import type { MpSlug } from "../data/mps.ts";
import { ALL_OPTION, countyData, NATIONAL_LIST, parseDistrict, sortedMps } from "../islands/mps-section.tsx";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { MpSelectCard } from "./mp-select-card.tsx";

function ChevronDownIcon(): JSX.Element {
	return (
		<svg class="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
		</svg>
	);
}

function SearchIcon(): JSX.Element {
	return (
		<svg class="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={2}
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	);
}

interface MpSelectorProps {
	selectedMps: Signal<Set<MpSlug>>;
	selectedCounty: Signal<string>;
	selectedDistrict: Signal<string>;
	searchQuery: Signal<string>;
	lang: SupportedLanguage;
}

export function MpSelector(props: MpSelectorProps): JSX.Element {
	const { selectedMps, selectedCounty, selectedDistrict, searchQuery, lang } = props;

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
				<div class="relative">
					<label
						for="action-county-select"
						class="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5"
					>
						{t("mps.filter.county", lang)}
					</label>
					<select
						id="action-county-select"
						value={selectedCounty.value}
						onChange={handleCountyChange}
						class="w-full h-11 pl-3 pr-8 bg-white/10 border-2 border-white/20 rounded-md text-sm text-white font-medium appearance-none cursor-pointer transition-all duration-150 hover:border-white/40 focus:outline-none focus:border-white/50"
					>
						<option value="" class="text-slate-900">{t("mps.filter.select_county", lang)}</option>
						<option value={ALL_OPTION} class="text-slate-900">{t("mps.filter.all", lang)}</option>
						{countyData.map((county) => (
							<option key={county.name} value={county.name} class="text-slate-900">
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
					</select>
					<div class="pointer-events-none absolute right-3 bottom-3.5">
						<ChevronDownIcon />
					</div>
				</div>

				{/* District dropdown */}
				<div class="relative">
					<label
						for="action-district-select"
						class={`block text-xs font-semibold uppercase tracking-wider mb-1.5 transition-colors ${
							districtDisabled ? "text-white/30" : "text-white/70"
						}`}
					>
						{t("mps.filter.district", lang)}
					</label>
					<select
						id="action-district-select"
						value={selectedDistrict.value}
						disabled={districtDisabled}
						onChange={handleDistrictChange}
						class={`w-full h-11 pl-3 pr-8 border-2 rounded-md text-sm font-medium appearance-none transition-all duration-150 focus:outline-none ${
							districtDisabled
								? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
								: "bg-white/10 border-white/20 text-white cursor-pointer hover:border-white/40 focus:border-white/50"
						}`}
					>
						<option value="" class="text-slate-900">{t("mps.filter.select_district", lang)}</option>
						{currentCountyData.value?.districts.map((district) => (
							<option key={district} value={district} class="text-slate-900">
								{district}
							</option>
						))}
					</select>
					<div
						class={`pointer-events-none absolute right-3 bottom-3.5 ${
							districtDisabled ? "opacity-30" : ""
						}`}
					>
						<ChevronDownIcon />
					</div>
				</div>

				{/* Search input */}
				<div class="relative">
					<label
						for="action-search"
						class="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5"
					>
						{t("action.search_placeholder", lang)}
					</label>
					<div class="relative">
						<input
							id="action-search"
							type="text"
							value={searchQuery.value}
							onInput={handleSearchInput}
							placeholder={t("action.search_placeholder", lang)}
							class="w-full h-11 pl-10 pr-4 bg-white/10 border-2 border-white/20 rounded-md text-sm text-white placeholder-white/40 font-medium transition-all duration-150 hover:border-white/40 focus:outline-none focus:border-white/50"
						/>
						<div class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
							<SearchIcon />
						</div>
					</div>
				</div>
			</div>

			{/* Selection controls */}
			<div class="flex flex-wrap items-center gap-4 mb-6">
				<button
					type="button"
					onClick={handleSelectAll}
					disabled={filteredMps.value.length === 0}
					class="px-4 py-2 text-sm font-medium bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{t("action.select_all", lang)}
				</button>
				<button
					type="button"
					onClick={handleDeselectAll}
					disabled={selectedMps.value.size === 0}
					class="px-4 py-2 text-sm font-medium bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{t("action.deselect_all", lang)}
				</button>
				<span class="text-white/80 text-sm">
					{t("action.selected_count", lang, { count: selectedMps.value.size.toString() })}
				</span>
			</div>

			{/* No filter selected message */}
			{!selectedCounty.value && !searchQuery.value && (
				<p class="text-white/60 text-center py-8">
					{t("mps.filter.select_to_show", lang)}
				</p>
			)}

			{/* MP grid */}
			{(selectedCounty.value || searchQuery.value) && filteredMps.value.length > 0 && (
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
				<p class="text-white/60 text-center py-8">
					{t("mps.no_results", lang)}
				</p>
			)}
		</div>
	);
}
