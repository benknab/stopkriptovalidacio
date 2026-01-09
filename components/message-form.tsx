import type { JSX } from "preact";
import type { Signal } from "@preact/signals";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { Input, Label, Textarea } from "./form.tsx";

interface MessageFormProps {
	subject: Signal<string>;
	message: Signal<string>;
	lang: SupportedLanguage;
	onNext: () => void;
}

export function MessageForm({ subject, message, lang, onNext }: MessageFormProps): JSX.Element {
	function handleSubjectInput(e: Event): void {
		subject.value = (e.target as HTMLInputElement).value;
	}

	function handleMessageInput(e: Event): void {
		message.value = (e.target as HTMLTextAreaElement).value;
	}

	return (
		<div class="max-w-2xl mx-auto space-y-6">
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
					rows={12}
				/>
			</div>

			<div class="flex justify-end">
				<button
					type="button"
					onClick={onNext}
					class="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition-colors"
				>
					{t("action.next", lang)} →
				</button>
			</div>
		</div>
	);
}
