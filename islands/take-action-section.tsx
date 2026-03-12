import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { useStringQueryParam } from "../hooks/use-root-query-params.ts";
import { type Candidate, candidates, type RepealSupport } from "../data/candidates.ts";
import { coalitionsByName } from "../data/coalitions.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { H2 } from "../components/h2.tsx";
import { ActionButtons } from "../components/action-buttons.tsx";
import { Input, Label, SearchInput, Select, SelectWrapper, Textarea } from "../components/form.tsx";
import { CandidateImage } from "../components/candidate-image.tsx";
import { ExternalLink } from "../components/external-link.tsx";

// --- Module-level data processing ---

type CandidateEntry = Candidate;

const DUMMY_EMAIL = "jelolt@example.com";

type CandidateCountyData = {
	name: string;
	districts: string[];
};

function buildCandidateCountyData(): CandidateCountyData[] {
	const countyMap = new Map<string, Set<string>>();

	for (const candidate of candidates) {
		if (!countyMap.has(candidate.county)) {
			countyMap.set(candidate.county, new Set());
		}
		const districts = countyMap.get(candidate.county);
		if (districts) {
			districts.add(candidate.district);
		}
	}

	return Array.from(countyMap.entries())
		.sort((a, b) => a[0].localeCompare(b[0], "hu"))
		.map(([name, districts]) => ({
			name,
			districts: Array.from(districts).sort((a, b) => {
				const numA = parseInt(a);
				const numB = parseInt(b);
				return numA - numB;
			}),
		}));
}

const candidateCountyData = buildCandidateCountyData();

function getSortedCandidates(): CandidateEntry[] {
	return [...candidates].sort((a, b) => {
		const drawA = a.drawNumber ?? Infinity;
		const drawB = b.drawNumber ?? Infinity;
		if (drawA !== drawB) return drawA - drawB;
		return a.name.localeCompare(b.name, "hu");
	});
}

const sortedCandidates = getSortedCandidates();

// --- Stance badge ---

const stanceColors = {
	for: { badge: "bg-emerald-100 text-emerald-700" },
	against: { badge: "bg-red-100 text-red-700" },
	unknown: { badge: "bg-slate-100 text-slate-600" },
};

type StanceKey = keyof typeof stanceColors;

function getStanceKey(repealSupport: RepealSupport | null): StanceKey {
	return repealSupport ?? "unknown";
}

function getCoalitionRepealSupport(coalition: Candidate["coalition"]): RepealSupport | null {
	return coalitionsByName.get(coalition)?.repealSupport ?? null;
}

const INDEPENDENT_COALITION = "Független jelölt";

// --- Icons ---

function EmailIcon(): JSX.Element {
	return (
		<svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
			<path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
			<path d="M19 8.839l-7.556 3.778a2.75 2.75 0 01-2.888 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
		</svg>
	);
}

function FacebookIcon(): JSX.Element {
	return (
		<svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
			<path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
		</svg>
	);
}

function CopyCheckIcon(): JSX.Element {
	return (
		<svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
				clip-rule="evenodd"
			/>
		</svg>
	);
}

// --- CandidateCard ---

interface CandidateCardProps {
	candidate: Candidate;
	lang: SupportedLanguage;
}

function CandidateCard({ candidate, lang }: CandidateCardProps): JSX.Element {
	const candidateStanceKey = getStanceKey(candidate.repealSupport);
	const coalitionStanceKey = getStanceKey(getCoalitionRepealSupport(candidate.coalition));
	const isIndependent = candidate.coalition === INDEPENDENT_COALITION;
	const NOT_COPIED = false;
	const emailCopied = useSignal(NOT_COPIED);

	const hasEmails = candidate.emails.length > 0;
	const hasFacebook = !!candidate.facebook;

	async function handleCopyEmails(): Promise<void> {
		await navigator.clipboard.writeText(candidate.emails.join(", "));
		emailCopied.value = true;
		setTimeout(() => {
			emailCopied.value = NOT_COPIED;
		}, 2000);
	}

	const enabledButtonClass =
		"flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-colors";
	const disabledButtonClass =
		"flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed";

	return (
		<div class="relative bg-slate-50 rounded-xl p-4 border border-slate-200">
			<div class="flex items-center gap-3">
				<CandidateImage
					slug={candidate.slug}
					name={candidate.displayName}
					hasImage={!!candidate.imageUrl}
					size="sm"
					class="shrink-0"
				/>
				<div class="min-w-0 flex-1">
					<h4 class="font-medium text-slate-900 truncate">{candidate.displayName}</h4>
					<p class="text-sm text-slate-500 truncate">{candidate.coalition}</p>
					<p class="text-sm text-slate-400 truncate">{candidate.county}, {candidate.district}</p>
				</div>
			</div>

			<div class="mt-3 flex flex-col gap-1.5">
				<div class="flex items-center gap-2">
					<span class="text-xs text-slate-500 w-16 shrink-0">
						{t("candidates.stance.candidate_label", lang)}:
					</span>
					<span
						class={`text-xs font-medium py-0.5 rounded-full min-w-24 text-center ${
							stanceColors[candidateStanceKey].badge
						}`}
					>
						{t(`candidates.stance.${candidateStanceKey}`, lang)}
					</span>
				</div>
				{!isIndependent && (
					<div class="flex items-center gap-2">
						<span class="text-xs text-slate-500 w-16 shrink-0">
							{t("candidates.stance.coalition_label", lang)}:
						</span>
						<span
							class={`text-xs font-medium py-0.5 rounded-full min-w-24 text-center ${
								stanceColors[coalitionStanceKey].badge
							}`}
						>
							{t(`candidates.stance.${coalitionStanceKey}`, lang)}
						</span>
					</div>
				)}
			</div>

			<div class="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2">
				<button
					type="button"
					onClick={handleCopyEmails}
					disabled={!hasEmails}
					class={hasEmails ? enabledButtonClass : disabledButtonClass}
					title={hasEmails ? candidate.emails.join(", ") : undefined}
				>
					{emailCopied.value ? <CopyCheckIcon /> : <EmailIcon />}
					{emailCopied.value ? t("candidates.copied", lang) : t("candidates.copy_email", lang)}
				</button>
				{hasFacebook && candidate.facebook
					? (
						<a
							href={candidate.facebook}
							target="_blank"
							rel="noopener noreferrer"
							class={enabledButtonClass}
						>
							<FacebookIcon />
							Facebook
						</a>
					)
					: (
						<span class={disabledButtonClass}>
							<FacebookIcon />
							Facebook
						</span>
					)}
			</div>
		</div>
	);
}

// --- Main section ---

// Hungarian-only email content (recipients are Hungarian candidates)
const DEFAULT_SUBJECT = "Sürgős: 2025. évi LXVII. törvény - kriptoeszköz-szabályozás";
const DEFAULT_MESSAGE = `Tisztelt Képviselő Úr/Asszony!

Az Ön választókerületének lakosaként fordulok Önhöz a kriptoeszközökre vonatkozó új szabályozás (2025. évi LXVII. törvény) sürgős rendezése érdekében. A szabályozás becslések szerint 500 000 magyar állampolgárt érint, és jelenleg az állampolgároknak nincs lehetőségük a törvénynek való megfelelésre.

A helyzet:
- A törvény 2025 júliusában lépett hatályba, az SZTFH rendelet 2025. december 27-től alkalmazandó.
- A "validáló szolgáltató" fogalma kizárólag magyar sajátosság - sem az uniós MiCA-rendelet, sem a nemzetközi kriptoszektor nem ismeri.
- Jelenleg egyetlen validáló szolgáltató szerepel az SZTFH nyilvántartásában - egy újonnan alapított, a szakmában ismeretlen, minimális kapacitású cég.
- A szabályozás hatálybalépése óta több jelentős, uniós engedéllyel rendelkező szolgáltató hagyta el a magyar piacot.
- A törvény büntetőjogi következményeket fűz olyan tevékenységekhez, amelyek pontos tartalma nincs tisztázva.

Kérem, hogy mint országgyűlési képviselő, nyújtson be írásbeli kérdéseket az alábbiak szerint:

1. Írásbeli kérdés a Miniszterelnök felé:
Tervezi-e a Kormány kormányrendelet kiadását a 2025. évi LXVII. törvény kriptoeszközökre vonatkozó rendelkezéseinek végrehajtási moratóriumáról, amíg legalább több validáló szolgáltató nem áll rendelkezésre a piacon, és amíg az SZTFH nyilvános, gyakorlati útmutatót nem tesz közzé a validálás pontos eljárásáról?

2. Írásbeli kérdés az SZTFH elnöke felé:
Mikor tervezi az SZTFH közzétenni a részletes útmutatót a "validáló szolgáltató" tevékenységének pontos tartalmáról, valamint az időközi iránymutatást arról, hogy az állampolgárok hogyan kerülhetik el a Btk. szerinti felelősséget addig, amíg több szolgáltató nem áll rendelkezésre?

Kérem, hogy 30 napon belül tájékoztasson arról, hogy a kérdések benyújtásra kerültek-e.

Köszönöm figyelmét és segítségét.

Tisztelettel,
[Név]
[Település]`;

interface TakeActionSectionProps {
	lang: SupportedLanguage;
	selectedCounty: string;
	selectedDistrict: string;
}

export default function TakeActionSection(props: TakeActionSectionProps): JSX.Element {
	const { lang } = props;

	// Message state (Hungarian only)
	const subject = useSignal(DEFAULT_SUBJECT);
	const message = useSignal(DEFAULT_MESSAGE);

	// Filter state (synced to URL query params)
	const selectedCounty = useStringQueryParam({
		key: "megye",
		defaultValue: "",
		initialValue: props.selectedCounty,
	});
	const selectedDistrict = useStringQueryParam({
		key: "kerulet",
		defaultValue: "",
		initialValue: props.selectedDistrict,
	});
	const searchQuery = useSignal("");

	// Derived
	const currentCountyData = candidateCountyData.find((c) => c.name === selectedCounty.value);
	const districtDisabled = !selectedCounty.value;

	const filteredCandidates = sortedCandidates.filter((candidate) => {
		// Name/coalition search filter
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase();
			if (
				!candidate.name.toLowerCase().includes(query) &&
				!candidate.displayName.toLowerCase().includes(query) &&
				!candidate.coalition.toLowerCase().includes(query)
			) {
				return false;
			}
		}

		// County filter
		if (selectedCounty.value) {
			if (candidate.county !== selectedCounty.value) return false;

			// District filter
			if (selectedDistrict.value && candidate.district !== selectedDistrict.value) {
				return false;
			}
		}

		// Require at least one filter
		if (!selectedCounty.value && !searchQuery.value) {
			return false;
		}

		return true;
	});

	const emails = [DUMMY_EMAIL];

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

	function handleSubjectInput(e: Event): void {
		subject.value = (e.target as HTMLInputElement).value;
	}

	function handleMessageInput(e: Event): void {
		message.value = (e.target as HTMLTextAreaElement).value;
	}

	return (
		<section id="cselekedj" class="bg-brand text-white py-16 sm:py-24">
			<div class="mx-auto max-w-6xl px-4 sm:px-6">
				<H2 class="text-white">{t("action.title", lang)}</H2>
				<p class="mt-4 text-white/90 text-center max-w-2xl mx-auto font-semibold text-lg">
					{t("action.intro", lang)}
				</p>

				{/* White content container */}
				<div class="mt-10 bg-white rounded-2xl p-6 sm:p-8 text-slate-900">
					{/* Filters - Row 1: County + District */}
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
						<div>
							<Label for="candidate-county-select" uppercase>
								{t("mps.filter.county", lang)}
							</Label>
							<SelectWrapper>
								<Select
									id="candidate-county-select"
									value={selectedCounty.value}
									onChange={handleCountyChange}
								>
									<option value="">{t("mps.filter.select_county", lang)}</option>
									{candidateCountyData.map((county) => (
										<option key={county.name} value={county.name}>
											{county.name}
										</option>
									))}
								</Select>
							</SelectWrapper>
						</div>

						<div>
							<Label for="candidate-district-select" uppercase disabled={districtDisabled}>
								{t("mps.filter.district", lang)}
							</Label>
							<SelectWrapper disabled={districtDisabled}>
								<Select
									id="candidate-district-select"
									value={selectedDistrict.value}
									disabled={districtDisabled}
									onChange={handleDistrictChange}
								>
									<option value="">{t("mps.filter.select_district", lang)}</option>
									{currentCountyData?.districts.map((district) => (
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
						<SearchInput
							id="candidate-search"
							value={searchQuery.value}
							onInput={handleSearchInput}
							placeholder={t("candidates.search_placeholder", lang)}
						/>
					</div>

					{/* District lookup hint + showing count */}
					<div class="flex items-baseline justify-between mb-6">
						<p class="text-sm text-slate-500">
							{t("mps.district_lookup_hint", lang)}{" "}
							<ExternalLink
								href="https://vtr.valasztas.hu/ogy2026/egyeni-valasztokeruletek"
								class="underline"
							>
								valasztas.hu
							</ExternalLink>
						</p>
						{(selectedCounty.value || searchQuery.value) && (
							<p class="text-sm text-slate-600 shrink-0 ml-4">
								{t("candidates.showing", lang, {
									shown: filteredCandidates.length.toString(),
									total: sortedCandidates.length.toString(),
								})}
							</p>
						)}
					</div>

					{/* Stance explainer */}
					<p class="text-xs text-slate-500 mb-6 text-center">
						{t("candidates.stance.explainer_1", lang)}
						<br />
						{t("candidates.stance.explainer_2", lang)}
					</p>

					{/* No filter selected message */}
					{!selectedCounty.value && !searchQuery.value && (
						<p class="text-slate-400 text-center py-8">
							{t("candidates.filter.select_to_show", lang)}
						</p>
					)}

					{/* Candidate grid */}
					{(selectedCounty.value || searchQuery.value) &&
						filteredCandidates.length > 0 && (
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredCandidates.map((candidate) => (
								<CandidateCard
									key={candidate.slug}
									candidate={candidate}
									lang={lang}
								/>
							))}
						</div>
					)}

					{/* No results */}
					{(selectedCounty.value || searchQuery.value) &&
						filteredCandidates.length === 0 && (
						<p class="text-slate-400 text-center py-8">
							{t("candidates.no_results", lang)}
						</p>
					)}

					{/* Email Form */}
					<div class="mt-8 border-t border-slate-200 pt-8 space-y-6">
						<div>
							<Label for="action-subject">{t("action.subject_label", lang)}</Label>
							<Input
								id="action-subject"
								value={subject.value}
								onInput={handleSubjectInput}
							/>
						</div>

						<div>
							<Label for="action-message">{t("action.message_label", lang)}</Label>
							<Textarea
								id="action-message"
								value={message.value}
								onInput={handleMessageInput}
								rows={10}
							/>
						</div>
					</div>

					{/* Action Buttons */}
					<ActionButtons
						emails={emails}
						subject={subject.value}
						message={message.value}
						lang={lang}
					/>
				</div>
			</div>
		</section>
	);
}
