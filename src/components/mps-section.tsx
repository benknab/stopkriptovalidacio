import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { type Mp, mps, type MpSlug, voteSource, type VoteType } from "../data/mps.ts";

const voteColors: Record<VoteType, { badge: string; border: string }> = {
	yes: {
		badge: "bg-red-100 text-red-700",
		border: "border-red-400",
	},
	no: {
		badge: "bg-emerald-100 text-emerald-700",
		border: "border-slate-200",
	},
	abstain: {
		badge: "bg-amber-100 text-amber-700",
		border: "border-red-400",
	},
	absent: {
		badge: "bg-slate-100 text-slate-600",
		border: "border-red-400",
	},
	not_voted: {
		badge: "bg-slate-100 text-slate-600",
		border: "border-red-400",
	},
	banned: {
		badge: "bg-purple-100 text-purple-700",
		border: "border-slate-200",
	},
};

const votePriority: Record<VoteType, number> = {
	yes: 0,
	abstain: 1,
	not_voted: 2,
	absent: 3,
	no: 4,
	banned: 5,
};

function getSortedMps(): Array<{ slug: MpSlug; mp: Mp }> {
	const entries = Object.entries(mps) as Array<[MpSlug, Mp]>;

	return entries
		.map(([slug, mp]) => ({ slug, mp }))
		.sort((a, b) => {
			const priorityDiff = votePriority[a.mp.vote] - votePriority[b.mp.vote];
			if (priorityDiff !== 0) return priorityDiff;
			return a.mp.name.localeCompare(b.mp.name, "hu");
		});
}

const sortedMps = getSortedMps();

interface MpCardProps {
	mp: Mp;
}

function MpCard({ mp }: MpCardProps): JSX.Element {
	const { t } = useTranslation();
	const colors = voteColors[mp.vote];
	const emails = Array.from(mp.emails);

	return (
		<div
			className={`bg-white rounded-xl border-2 ${colors.border} p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col`}
		>
			<div className="flex items-start justify-between w-full mb-2">
				<h3 className="font-semibold text-slate-900">{mp.name}</h3>
				<span
					className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-2 ${colors.badge}`}
				>
					{t(`mps.vote.${mp.vote}`)}
				</span>
			</div>

			<p className="text-sm text-slate-500 mb-3">{mp.party}</p>

			<div className="space-y-1.5 text-sm">
				{mp.district && (
					<div className="flex items-center gap-2 text-slate-600">
						<svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<span>{mp.district}</span>
					</div>
				)}
				{emails.length > 0 && (
					<div className="flex items-start gap-2 text-slate-600">
						<svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<div className="flex flex-col gap-0.5">
							{emails.map((email) => (
								<a
									key={email}
									href={`mailto:${email}`}
									className="text-brand hover:text-brand-hover transition-colors break-all"
								>
									{email}
								</a>
							))}
						</div>
					</div>
				)}
				{mp.phone && (
					<div className="flex items-center gap-2 text-slate-600">
						<svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						<a
							href={`tel:${mp.phone}`}
							className="text-brand hover:text-brand-hover transition-colors"
						>
							{mp.phone}
						</a>
					</div>
				)}
			</div>
		</div>
	);
}

export function MpsSection(): JSX.Element {
	const { t } = useTranslation();

	return (
		<section id="kepviselok" className="bg-slate-50 py-16 sm:py-20">
			<div className="mx-auto max-w-4xl px-4 sm:px-6">
				<h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
					{t("mps.title")}
				</h2>
				<p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
					{t("mps.description")}
				</p>

				<div className="mt-8 p-4 bg-white rounded-lg border border-slate-200">
					<p className="text-sm text-slate-600">
						<strong>{t("mps.source")}:</strong>{" "}
						<a
							href={voteSource.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-brand hover:text-brand-hover transition-colors underline"
						>
							{voteSource.label}
						</a>
					</p>
				</div>

				<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{sortedMps.map(({ slug, mp }) => <MpCard key={slug} mp={mp} />)}
				</div>
			</div>
		</section>
	);
}
