import type { JSX } from "preact";
import { useSignal, useSignalEffect } from "@preact/signals";
import { useStringQueryParam } from "../hooks/use-root-query-params.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { H2 } from "../components/h2.tsx";
import { MpSelector } from "../components/mp-selector.tsx";
import { ActionButtons } from "../components/action-buttons.tsx";
import { Input, Label, Textarea } from "../components/form.tsx";

// Hungarian-only email content (recipients are Hungarian MPs)
const DEFAULT_SUBJECT = "Állásfoglalás kérése - 2025. évi LXVII. törvény";
const DEFAULT_MESSAGE = `Tisztelt Országgyűlési Képviselő!

Az Ön választókerületének lakosaként fordulok Önhöz a 2025. évi LXVII. törvény ügyében, amely mintegy 500 000 magyar állampolgárt érint.

A hatályba lépés óta 11 uniós engedéllyel rendelkező szolgáltató távozott a magyar piacról, az Európai Bizottság kötelezettségszegési eljárást indított Magyarország ellen (INFR(2025)2174), a "validálás" fogalma pedig jogszabályi szinten továbbra sincs definiálva - így a magánszemélyek büntetőjogi felelősség terhe mellett sem tudnak megfelelni a törvénynek.

Két kérdésre kérem válaszát:

1. Támogatja-e a törvény kriptoeszközökre vonatkozó rendelkezéseinek hatályon kívül helyezését? Ha igen, ezt milyen időkeretben tartja megvalósíthatónak?

2. Támogatja-e a magánszemélyeket fenyegető büntetőjogi szankciók azonnali visszavonását a szabályozás rendezéséig?

Kérem, 30 napon belül tájékoztasson álláspontjáról.

Köszönöm figyelmét.

Tisztelettel,
[Név]
[Település]`;

// Default to NOT include national and minority lists (user must opt-in)
const DEFAULT_INCLUDE_LISTS = false;

interface TakeActionSectionProps {
	lang: SupportedLanguage;
	selectedCounty: string;
	selectedDistrict: string;
	selectedRep: string;
}

export default function TakeActionSection({
	lang,
	selectedCounty: initialCounty,
	selectedDistrict: initialDistrict,
	selectedRep: initialRep,
}: TakeActionSectionProps): JSX.Element {
	// Message state (Hungarian only)
	const subject = useSignal(DEFAULT_SUBJECT);
	const message = useSignal(DEFAULT_MESSAGE);

	// Selection state - single representative synced to query params
	const selectedRep = useStringQueryParam({
		key: "kepviselo",
		defaultValue: "",
		initialValue: initialRep,
	});

	// Group selection state (default: include minority list)
	const includeMinorityList = useSignal(DEFAULT_INCLUDE_LISTS);

	// Filter state synced to query params
	const selectedCounty = useStringQueryParam({
		key: "megye",
		defaultValue: "",
		initialValue: initialCounty,
	});
	const selectedDistrict = useStringQueryParam({
		key: "kerulet",
		defaultValue: "",
		initialValue: initialDistrict,
	});

	// Search is local-only, not synced to URL
	const searchQuery = useSignal("");

	// Scroll to filters so the selected card is visible below them
	useSignalEffect(() => {
		if (selectedRep.value && typeof globalThis.document !== "undefined") {
			const element = globalThis.document.getElementById("action-filters");
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	});

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
				<p class="mt-4 text-white/90 text-center max-w-2xl mx-auto font-semibold text-lg whitespace-pre-line">
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
						selectedRep={selectedRep.value || null}
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
