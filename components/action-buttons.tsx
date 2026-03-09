import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { buildMailtoUrl } from "../utils/mailto.ts";

interface CopyButtonProps {
	onClick: () => void;
	disabled?: boolean;
	children: string;
}

function CopyButton({ onClick, disabled, children }: CopyButtonProps): JSX.Element {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			class="px-4 py-2 border-2 border-brand text-brand font-medium rounded-lg hover:bg-brand/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
		>
			{children}
		</button>
	);
}

interface ActionButtonsProps {
	emails: string[];
	subject: string;
	message: string;
	lang: SupportedLanguage;
}

export function ActionButtons({ emails, subject, message, lang }: ActionButtonsProps): JSX.Element {
	const copyFeedback = useSignal<"emails" | "message" | "subject" | null>(null);

	const hasSelection = emails.length > 0;
	const mailtoUrl = hasSelection ? buildMailtoUrl({ to: emails, subject, body: message }) : undefined;

	async function copyEmails(): Promise<void> {
		await navigator.clipboard.writeText(emails.join(","));
		copyFeedback.value = "emails";
		setTimeout(() => {
			copyFeedback.value = null;
		}, 2000);
	}

	async function copyMessage(): Promise<void> {
		await navigator.clipboard.writeText(message);
		copyFeedback.value = "message";
		setTimeout(() => {
			copyFeedback.value = null;
		}, 2000);
	}

	async function copySubject(): Promise<void> {
		await navigator.clipboard.writeText(subject);
		copyFeedback.value = "subject";
		setTimeout(() => {
			copyFeedback.value = null;
		}, 2000);
	}

	return (
		<div class="mt-8 space-y-4">
			{/* Main button */}
			<div class="flex justify-center">
				{hasSelection
					? (
						<a
							href={mailtoUrl}
							class="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition-colors"
						>
							{t("action.send", lang)}
						</a>
					)
					: (
						<span class="px-6 py-3 bg-slate-200 text-slate-400 font-semibold rounded-lg cursor-not-allowed">
							{t("action.send", lang)}
						</span>
					)}
			</div>

			{/* Copy section */}
			<p class="text-slate-500 text-sm text-center mt-6">
				{t("action.copy_manual_hint", lang)}
			</p>
			<div class="flex flex-wrap justify-center gap-3 mt-3">
				<CopyButton onClick={copyEmails} disabled={!hasSelection}>
					{copyFeedback.value === "emails" ? t("action.copied", lang) : t("action.copy_emails", lang)}
				</CopyButton>
				<CopyButton onClick={copySubject}>
					{copyFeedback.value === "subject" ? t("action.copied", lang) : t("action.copy_subject", lang)}
				</CopyButton>
				<CopyButton onClick={copyMessage}>
					{copyFeedback.value === "message" ? t("action.copied", lang) : t("action.copy_message", lang)}
				</CopyButton>
			</div>
		</div>
	);
}
