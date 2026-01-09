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
	const copyFeedback = useSignal<"emails" | "message" | null>(null);

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

	return (
		<div class="mt-8 space-y-4">
			{/* Warning */}
			{showWarning && (
				<div class="p-4 bg-amber-500/20 border border-amber-400/50 rounded-lg flex items-start gap-3">
					<WarningIcon />
					<p class="text-amber-100 text-sm">
						{t("action.email_warning", lang, { count: emailCount.toString() })}
					</p>
				</div>
			)}

			{/* Email count */}
			<p class="text-white/80 text-center">
				{hasSelection
					? t("action.email_count", lang, { count: emailCount.toString() })
					: t("action.no_selection", lang)}
			</p>

			{/* Buttons */}
			<div class="flex flex-wrap justify-center gap-4">
				<button
					type="button"
					onClick={onBack}
					class="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
				>
					← {t("action.back", lang)}
				</button>

				{hasSelection
					? (
						<a
							href={mailtoUrl}
							class="px-6 py-3 bg-white text-brand font-semibold rounded-lg hover:bg-white/90 transition-colors"
						>
							{t("action.send", lang)}
						</a>
					)
					: (
						<span class="px-6 py-3 bg-white/20 text-white/50 font-semibold rounded-lg cursor-not-allowed">
							{t("action.send", lang)}
						</span>
					)}

				<button
					type="button"
					onClick={copyEmails}
					disabled={!hasSelection}
					class="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{copyFeedback.value === "emails" ? t("action.copied", lang) : t("action.copy_emails", lang)}
				</button>

				<button
					type="button"
					onClick={copyMessage}
					class="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
				>
					{copyFeedback.value === "message" ? t("action.copied", lang) : t("action.copy_message", lang)}
				</button>
			</div>

			{/* Outlook hint */}
			<p class="text-white/50 text-xs text-center">
				{t("action.copy_hint", lang)}
			</p>
		</div>
	);
}
