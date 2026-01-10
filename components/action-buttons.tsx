import type { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { mps, type MpSlug } from "../data/mps.ts";
import { minorityListMps, nationalListMps } from "../islands/mps-section.tsx";
import { type SupportedLanguage, t } from "../i18n/index.ts";

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

interface EmailLists {
	to: string[];
	cc: string[];
	all: string[];
}

function getEmailLists(
	selectedRep: MpSlug | null,
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
		for (const { mp } of nationalListMps) {
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
		for (const { mp } of minorityListMps) {
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

function generateMailtoUrl(to: string[], cc: string[], subject: string, body: string): string {
	// RFC 6068 compliant line break handling for mailto URLs
	// 1. Normalize all line endings to \n
	// 2. Replace \n with pre-encoded %0D%0A
	// 3. Encode the result, then undo double-encoding of line breaks
	// NOTE: Protonmail doesn't handle mailto body correctly - users should use copy buttons instead
	const normalizedBody = body.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	const bodyWithLineBreaks = normalizedBody.replace(/\n/g, "%0D%0A");
	const encodedBody = encodeURIComponent(bodyWithLineBreaks).replace(/%250D%250A/g, "%0D%0A");

	let url = `mailto:${to.map(encodeURIComponent).join(",")}?subject=${
		encodeURIComponent(subject)
	}&body=${encodedBody}`;
	if (cc.length > 0) {
		url += `&cc=${cc.map(encodeURIComponent).join(",")}`;
	}
	return url;
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

	const emailLists = getEmailLists(selectedRep, includeNationalList, includeMinorityList);
	const hasSelection = selectedRep !== null;

	const mailtoUrl = hasSelection ? generateMailtoUrl(emailLists.to, emailLists.cc, subject, message) : undefined;

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
