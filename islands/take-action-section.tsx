import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import type { MpSlug } from "../data/mps.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { H2 } from "../components/h2.tsx";
import { MpSelector } from "../components/mp-selector.tsx";
import { ActionButtons } from "../components/action-buttons.tsx";
import { Input, Label, Textarea } from "../components/form.tsx";

// Hungarian-only email content (recipients are Hungarian MPs)
const DEFAULT_SUBJECT = "Kérem, állítsák meg a kriptovaluta validációs törvényt";
const DEFAULT_MESSAGE = `Tisztelt Képviselő Úr/Asszony!

[Placeholder message body - a felhasználó által megadott sablonnal lesz kitöltve]

Tisztelettel,
[Név]`;

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
