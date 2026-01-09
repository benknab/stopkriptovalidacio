import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { mps, type MpSlug } from "../data/mps.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";

function WarningIcon(): JSX.Element {
	return (
		<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={2}
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
	);
}

function getSelectedEmails(selectedMps: Set<MpSlug>): string[] {
	return Array.from(selectedMps).flatMap((slug) => Array.from(mps[slug].emails));
}

function generateMailtoUrl(emails: string[], subject: string, body: string): string {
	const to = emails.join(",");
	const params = new URLSearchParams({ subject, body });
	return `mailto:${to}?${params.toString()}`;
}

interface ActionButtonsProps {
	selectedMps: Set<MpSlug>;
	subject: string;
	message: string;
	lang: SupportedLanguage;
	onBack: () => void;
}

export function ActionButtons({ selectedMps, subject, message, lang, onBack }: ActionButtonsProps): JSX.Element {
	const copyFeedback = useSignal<"emails" | "message" | "subject" | null>(null);

	const emails = getSelectedEmails(selectedMps);
	const emailCount = emails.length;
	const showWarning = emailCount > 30;
	const hasSelection = selectedMps.size > 0;

	const mailtoUrl = hasSelection ? generateMailtoUrl(emails, subject, message) : undefined;

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
			{/* Warning */}
			{showWarning && (
				<div class="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
					<span class="text-amber-600">
						<WarningIcon />
					</span>
					<p class="text-amber-800 text-sm">
						{t("action.email_warning", lang, { count: emailCount.toString() })}
					</p>
				</div>
			)}

			{/* Email count */}
			<p class="text-slate-600 text-center">
				{hasSelection
					? t("action.email_count", lang, { count: emailCount.toString() })
					: t("action.no_selection", lang)}
			</p>

			{/* Main buttons */}
			<div class="flex justify-center gap-4">
				<button
					type="button"
					onClick={onBack}
					class="px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:border-slate-400 transition-colors"
				>
					← {t("action.back", lang)}
				</button>

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
				<button
					type="button"
					onClick={copySubject}
					class="px-4 py-2 border-2 border-brand text-brand font-medium rounded-lg hover:bg-brand/5 transition-colors"
				>
					{copyFeedback.value === "subject" ? t("action.copied", lang) : t("action.copy_subject", lang)}
				</button>
				<button
					type="button"
					onClick={copyMessage}
					class="px-4 py-2 border-2 border-brand text-brand font-medium rounded-lg hover:bg-brand/5 transition-colors"
				>
					{copyFeedback.value === "message" ? t("action.copied", lang) : t("action.copy_message", lang)}
				</button>
				<button
					type="button"
					onClick={copyEmails}
					disabled={!hasSelection}
					class="px-4 py-2 border-2 border-brand text-brand font-medium rounded-lg hover:bg-brand/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
				>
					{copyFeedback.value === "emails" ? t("action.copied", lang) : t("action.copy_emails", lang)}
				</button>
			</div>
		</div>
	);
}
