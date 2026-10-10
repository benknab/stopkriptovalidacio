import type { SyntheticEvent } from "react";
import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useStringQueryParam } from "../hooks/use-root-query-params.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { H2 } from "./h2.tsx";
import { MpSelector } from "./mp-selector.tsx";
import { ActionButtons } from "./action-buttons.tsx";
import { Input, Label, Textarea } from "./form.tsx";

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
	const [subject, setSubject] = useState(DEFAULT_SUBJECT);
	const [message, setMessage] = useState(DEFAULT_MESSAGE);

	// Selection state - single representative synced to query params
	const [selectedRep, setSelectedRep] = useStringQueryParam({
		key: "kepviselo",
		defaultValue: "",
		initialValue: initialRep,
	});

	// Group selection state (default: include minority list)
	const [includeMinorityList, setIncludeMinorityList] = useState(DEFAULT_INCLUDE_LISTS);

	// Filter state synced to query params
	const [selectedCounty, setSelectedCounty] = useStringQueryParam({
		key: "megye",
		defaultValue: "",
		initialValue: initialCounty,
	});
	const [selectedDistrict, setSelectedDistrict] = useStringQueryParam({
		key: "kerulet",
		defaultValue: "",
		initialValue: initialDistrict,
	});

	// Search is local-only, not synced to URL
	const [searchQuery, setSearchQuery] = useState("");

	// Scroll to filters so the selected card is visible below them
	useEffect(() => {
		if (selectedRep && typeof globalThis.document !== "undefined") {
			const element = globalThis.document.getElementById("action-filters");
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	}, [selectedRep]);

	function handleSubjectInput(e: SyntheticEvent): void {
		setSubject((e.target as HTMLInputElement).value);
	}

	function handleMessageInput(e: SyntheticEvent): void {
		setMessage((e.target as HTMLTextAreaElement).value);
	}

	return (
		<section id="cselekedj" className="bg-brand text-white py-16 sm:py-24">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<H2 className="text-white">{t("action.title", lang)}</H2>
				<p className="mt-4 text-white/90 text-center max-w-2xl mx-auto font-semibold text-lg whitespace-pre-line">
					{t("action.intro", lang)}
				</p>

				{/* White content container */}
				<div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 text-slate-900">
					{/* Search/Filter Section with integrated selection display */}
					<MpSelector
						selectedRep={[selectedRep, setSelectedRep]}
						selectedCounty={[selectedCounty, setSelectedCounty]}
						selectedDistrict={[selectedDistrict, setSelectedDistrict]}
						searchQuery={[searchQuery, setSearchQuery]}
						includeMinorityList={[includeMinorityList, setIncludeMinorityList]}
						lang={lang}
					/>

					{/* Email Form */}
					<div className="mt-8 border-t border-slate-200 pt-8 space-y-6">
						<div>
							<Label htmlFor="action-subject">{t("action.subject_label", lang)}</Label>
							<Input id="action-subject" value={subject} onChange={handleSubjectInput} />
						</div>

						<div>
							<Label htmlFor="action-message">{t("action.message_label", lang)}</Label>
							<Textarea id="action-message" value={message} onChange={handleMessageInput} rows={10} />
						</div>
					</div>

					{/* Action Buttons */}
					<ActionButtons
						selectedRep={selectedRep || null}
						includeMinorityList={includeMinorityList}
						subject={subject}
						message={message}
						lang={lang}
					/>
				</div>
			</div>
		</section>
	);
}
