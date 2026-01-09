import type { JSX } from "preact";
import type { Signal } from "@preact/signals";
import { type SupportedLanguage, t } from "../i18n/index.ts";

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
				<label
					for="action-subject"
					class="block text-sm font-semibold text-white/90 mb-2"
				>
					{t("action.subject_label", lang)}
				</label>
				<input
					id="action-subject"
					type="text"
					value={subject.value}
					onInput={handleSubjectInput}
					class="w-full px-4 py-3 rounded-lg bg-white text-slate-900 border-2 border-transparent focus:border-white/50 focus:outline-none transition-colors"
				/>
			</div>

			<div>
				<label
					for="action-message"
					class="block text-sm font-semibold text-white/90 mb-2"
				>
					{t("action.message_label", lang)}
				</label>
				<textarea
					id="action-message"
					value={message.value}
					onInput={handleMessageInput}
					rows={12}
					class="w-full px-4 py-3 rounded-lg bg-white text-slate-900 border-2 border-transparent focus:border-white/50 focus:outline-none resize-y transition-colors"
				/>
			</div>

			<div class="flex justify-end">
				<button
					type="button"
					onClick={onNext}
					class="px-6 py-3 bg-white text-brand font-semibold rounded-lg hover:bg-white/90 transition-colors"
				>
					{t("action.next", lang)} →
				</button>
			</div>
		</div>
	);
}
