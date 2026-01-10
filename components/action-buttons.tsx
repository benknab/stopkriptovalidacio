import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { mps, type MpSlug } from "../data/mps.ts";
import { minorityListMps, nationalListMps } from "../islands/mps-section.tsx";
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

function getAllEmails(
	selectedRep: MpSlug | null,
	includeNationalList: boolean,
	includeMinorityList: boolean,
): string[] {
	const emails: Set<string> = new Set();

	// Add selected representative's emails
	if (selectedRep) {
		const mp = mps[selectedRep];
		if (mp) {
			for (const email of mp.emails) {
				emails.add(email);
			}
		}
	}

	// Add national list MPs' emails
	if (includeNationalList) {
		for (const { mp } of nationalListMps) {
			for (const email of mp.emails) {
				emails.add(email);
			}
		}
	}

	// Add minority list MPs' emails
	if (includeMinorityList) {
		for (const { mp } of minorityListMps) {
			for (const email of mp.emails) {
				emails.add(email);
			}
		}
	}

	return Array.from(emails);
}

function generateMailtoUrl(emails: string[], subject: string, body: string): string {
	const to = emails.join(",");
	const params = new URLSearchParams({ subject, body });
	return `mailto:${to}?${params.toString()}`;
}

interface ActionButtonsProps {
	selectedRep: MpSlug | null;
	includeNationalList: boolean;
	includeMinorityList: boolean;
	subject: string;
	message: string;
	lang: SupportedLanguage;
}

export function ActionButtons(props: ActionButtonsProps): JSX.Element {
	const { selectedRep, includeNationalList, includeMinorityList, subject, message, lang } = props;
	const copyFeedback = useSignal<"emails" | "message" | "subject" | null>(null);

	const emails = getAllEmails(selectedRep, includeNationalList, includeMinorityList);
	const emailCount = emails.length;
	const hasSelection = selectedRep !== null;
	const showWarning = hasSelection && emailCount > 30;

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
