import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import type { MpSlug } from "../data/mps.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { H2 } from "../components/h2.tsx";
import { MpSelector } from "../components/mp-selector.tsx";
import { ActionButtons } from "../components/action-buttons.tsx";
import { Input, Label, Textarea } from "../components/form.tsx";

// Hungarian-only email content (recipients are Hungarian MPs)
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
[Település, választókerület megjelölése]`;

// Default to include national and minority lists
const DEFAULT_INCLUDE_LISTS = true;

interface TakeActionSectionProps {
	lang: SupportedLanguage;
}

export default function TakeActionSection({ lang }: TakeActionSectionProps): JSX.Element {
	// Message state (Hungarian only)
	const subject = useSignal(DEFAULT_SUBJECT);
	const message = useSignal(DEFAULT_MESSAGE);

	// Selection state - single representative
	const selectedRep = useSignal<MpSlug | null>(null);

	// Group selection state (default: include both lists)
	const includeNationalList = useSignal(DEFAULT_INCLUDE_LISTS);
	const includeMinorityList = useSignal(DEFAULT_INCLUDE_LISTS);

	// Filter state
	const selectedCounty = useSignal("");
	const selectedDistrict = useSignal("");
	const searchQuery = useSignal("");

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
					{/* Search/Filter Section with integrated selection display */}
					<MpSelector
						selectedRep={selectedRep}
						selectedCounty={selectedCounty}
						selectedDistrict={selectedDistrict}
						searchQuery={searchQuery}
						includeNationalList={includeNationalList}
						includeMinorityList={includeMinorityList}
						lang={lang}
					/>

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
						selectedRep={selectedRep.value}
						includeNationalList={includeNationalList.value}
						includeMinorityList={includeMinorityList.value}
						subject={subject.value}
						message={message.value}
						lang={lang}
					/>
				</div>
			</div>
		</section>
	);
}
