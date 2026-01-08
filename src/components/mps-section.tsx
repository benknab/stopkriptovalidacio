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
	const emails = Array.from(mp.emails).filter((e) => e);

	return (
		<div
			className={`relative bg-white rounded-xl border-2 ${colors.border} p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center`}
		>
			<span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${colors.badge}`}>
				{t(`mps.vote.${mp.vote}`)}
			</span>

			{mp.imageUrl
				? (
					<img
						src={mp.imageUrl}
						alt={mp.name}
						className="w-12 h-12 rounded-full object-cover mb-3 border-2 border-slate-200"
					/>
				)
				: (
					<div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3 border-2 border-slate-300">
						<span className="text-slate-500 text-lg">👤</span>
					</div>
				)}

			<h3 className="font-semibold text-slate-900">{mp.name}</h3>
			<p className="text-sm text-slate-500 mb-3">{mp.party}</p>

			<div className="space-y-1 text-sm text-slate-600">
				{mp.district && <div>📍 {mp.district}</div>}
				{emails.length > 0 && (
					<div>
						📧 {emails.map((email, i) => (
							<span key={email}>
								{i > 0 && ", "}
								<a
									href={`mailto:${email}`}
									className="text-brand hover:text-brand-hover transition-colors break-all"
								>
									{email}
								</a>
							</span>
						))}
					</div>
				)}
				{mp.phone && (
					<div>
						📞{" "}
						<a href={`tel:${mp.phone}`} className="text-brand hover:text-brand-hover transition-colors">
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
