import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import type { MpSlug } from "../data/mps.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { H2 } from "../components/h2.tsx";
import { ActionStepTabs } from "../components/action-step-tabs.tsx";
import { MessageForm } from "../components/message-form.tsx";
import { MpSelector } from "../components/mp-selector.tsx";
import { ActionButtons } from "../components/action-buttons.tsx";

// Hungarian-only email content (recipients are Hungarian MPs)
const DEFAULT_SUBJECT = "Kérem, állítsák meg a kriptovaluta validációs törvényt";
const DEFAULT_MESSAGE = `Tisztelt Képviselő Úr/Asszony!

[Placeholder message body - a felhasználó által megadott sablonnal lesz kitöltve]

Tisztelettel,
[Név]`;

interface TakeActionSectionProps {
	lang: SupportedLanguage;
}

export default function TakeActionSection({ lang }: TakeActionSectionProps): JSX.Element {
	// Wizard state
	const step = useSignal<1 | 2>(1);

	// Message state (Hungarian only)
	const subject = useSignal(DEFAULT_SUBJECT);
	const message = useSignal(DEFAULT_MESSAGE);

	// Selection state
	const selectedMps = useSignal<Set<MpSlug>>(new Set());

	// Filter state
	const selectedCounty = useSignal("");
	const selectedDistrict = useSignal("");
	const searchQuery = useSignal("");

	function handleNext(): void {
		step.value = 2;
	}

	function handleBack(): void {
		step.value = 1;
	}

	return (
		<section id="cselekedj" class="bg-brand text-white py-16 sm:py-24">
			<div class="mx-auto max-w-6xl px-4 sm:px-6">
				<H2 class="text-white">{t("action.title", lang)}</H2>
				<p class="mt-4 text-white/80 text-center max-w-2xl mx-auto">
					{t("action.intro", lang)}
				</p>

				<ActionStepTabs step={step.value} lang={lang} />

				{step.value === 1 && (
					<MessageForm
						subject={subject}
						message={message}
						lang={lang}
						onNext={handleNext}
					/>
				)}

				{step.value === 2 && (
					<>
						<MpSelector
							selectedMps={selectedMps}
							selectedCounty={selectedCounty}
							selectedDistrict={selectedDistrict}
							searchQuery={searchQuery}
							lang={lang}
						/>
						<ActionButtons
							selectedMps={selectedMps.value}
							subject={subject.value}
							message={message.value}
							lang={lang}
							onBack={handleBack}
						/>
					</>
				)}
			</div>
		</section>
	);
}
