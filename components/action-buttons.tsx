import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { type MpId, mps } from "../data/mps.ts";
import { currentMinorityListMps, currentNationalListMps } from "../islands/mps-section.tsx";
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

function FacebookIcon(): JSX.Element {
	return (
		<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.6 1.7-1.6H16V4.8c-.3 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3V11H9v3h2.3v7h2.2Z" />
		</svg>
	);
}

interface EmailLists {
	to: string[];
	cc: string[];
	all: string[];
}

function getEmailLists(
	selectedRep: MpId | null,
	includeNationalList: boolean,
	includeMinorityList: boolean,
): EmailLists {
	const toEmails: Set<string> = new Set();
	const ccEmails: Set<string> = new Set();

	// Selected representative's emails go to "To:"
	if (selectedRep) {
		const mp = mps[selectedRep];
		if (mp) {
			for (const email of mp.emails) {
				toEmails.add(email);
			}
		}
	}

	// National list MPs' emails go to "CC:"
	if (includeNationalList) {
		for (const { mp } of currentNationalListMps) {
			for (const email of mp.emails) {
				// Don't add to CC if already in To
				if (!toEmails.has(email)) {
					ccEmails.add(email);
				}
			}
		}
	}

	// Minority list MPs' emails go to "CC:"
	if (includeMinorityList) {
		for (const { mp } of currentMinorityListMps) {
			for (const email of mp.emails) {
				// Don't add to CC if already in To
				if (!toEmails.has(email)) {
					ccEmails.add(email);
				}
			}
		}
	}

	const to = Array.from(toEmails);
	const cc = Array.from(ccEmails);

	return {
		to,
		cc,
		all: [...to, ...cc],
	};
}

interface ActionButtonsProps {
	selectedRep: MpId | null;
	includeNationalList: boolean;
	includeMinorityList: boolean;
	subject: string;
	message: string;
	lang: SupportedLanguage;
}

export function ActionButtons(props: ActionButtonsProps): JSX.Element {
	const { selectedRep, includeNationalList, includeMinorityList, subject, message, lang } = props;
	const copyFeedback = useSignal<"emails" | "message" | "subject" | null>(null);

	const emailLists = getEmailLists(selectedRep, includeNationalList, includeMinorityList);
	const selectedMp = selectedRep ? mps[selectedRep] : null;
	const selectedRepHasDirectEmail = (selectedMp?.emails.size ?? 0) > 0;
	const selectedRepFacebookUrl = selectedMp?.facebookUrl ?? null;
	const shouldShowFacebookAction = !selectedRepHasDirectEmail && !!selectedRepFacebookUrl;
	const hasEmails = emailLists.all.length > 0;

	const mailtoUrl = hasEmails ? buildMailtoUrl({ to: emailLists.all, subject, body: message }) : undefined;

	async function copyEmails(): Promise<void> {
		await navigator.clipboard.writeText(emailLists.all.join(","));
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
			<div class="flex flex-wrap justify-center gap-3">
				{hasEmails
					? (
						<a
							href={mailtoUrl ?? ""}
							class="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition-colors"
						>
							{t("action.send", lang)}
						</a>
					)
					: !shouldShowFacebookAction && (
						<span class="px-6 py-3 bg-slate-200 text-slate-400 font-semibold rounded-lg cursor-not-allowed">
							{t("action.send", lang)}
						</span>
					)}
				{shouldShowFacebookAction && selectedRepFacebookUrl && (
					<a
						href={selectedRepFacebookUrl}
						target="_blank"
						rel="noopener"
						class="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white font-semibold rounded-lg hover:bg-[#1669d5] transition-colors"
					>
						<FacebookIcon />
						{t("action.open_facebook", lang)}
					</a>
				)}
			</div>

			{/* Copy section */}
			<p class="text-slate-500 text-sm text-center mt-6">
				{shouldShowFacebookAction ? t("action.facebook_manual_hint", lang) : t("action.copy_manual_hint", lang)}
			</p>
			<div class="flex flex-wrap justify-center gap-3 mt-3">
				<CopyButton onClick={copyEmails} disabled={!hasEmails}>
					{copyFeedback.value === "emails" ? t("action.copied", lang) : t("action.copy_emails", lang)}
				</CopyButton>
				<CopyButton onClick={copySubject} disabled={!hasEmails}>
					{copyFeedback.value === "subject" ? t("action.copied", lang) : t("action.copy_subject", lang)}
				</CopyButton>
				<CopyButton onClick={copyMessage}>
					{copyFeedback.value === "message" ? t("action.copied", lang) : t("action.copy_message", lang)}
				</CopyButton>
			</div>
		</div>
	);
}
