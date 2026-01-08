import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { type Exchange, exchanges, type ExchangeSlug, type ExchangeStatus } from "../data/exchanges.ts";

const statusPriority: Record<ExchangeStatus, number> = {
	operating: 0,
	leaving: 1,
	unknown: 2,
};

const statusColors: Record<ExchangeStatus, { border: string; badge: string }> = {
	operating: {
		border: "border-t-emerald-500",
		badge: "bg-emerald-100 text-emerald-700",
	},
	leaving: {
		border: "border-t-red-500",
		badge: "bg-red-100 text-red-700",
	},
	unknown: {
		border: "border-t-amber-500",
		badge: "bg-amber-100 text-amber-700",
	},
};

function getSortedExchanges(): Array<{ slug: ExchangeSlug; exchange: Exchange }> {
	const entries = Object.entries(exchanges) as Array<[ExchangeSlug, Exchange]>;

	return entries
		.map(([slug, exchange]) => ({ slug, exchange }))
		.sort((a, b) => {
			const priorityDiff = statusPriority[a.exchange.status] - statusPriority[b.exchange.status];
			if (priorityDiff !== 0) return priorityDiff;
			return a.exchange.name.localeCompare(b.exchange.name);
		});
}

const sortedExchanges = getSortedExchanges();

interface ExchangeCardProps {
	slug: ExchangeSlug;
	exchange: Exchange;
}

function formatDate(date: Date, lang: string): string {
	return date.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function ExchangeCard({ slug, exchange }: ExchangeCardProps): JSX.Element {
	const { t, i18n } = useTranslation();
	const colors = statusColors[exchange.status];
	const now = new Date();
	const hasLeft = exchange.leaveDate && exchange.leaveDate <= now;
	const willLeave = exchange.leaveDate && exchange.leaveDate > now;

	return (
		<div
			className={`bg-white rounded-xl border border-slate-200 border-t-4 ${colors.border} p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full`}
		>
			<div className="flex justify-between items-start gap-3 mb-2">
				<h3 className="font-semibold text-slate-900">{exchange.name}</h3>
				<span
					className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${colors.badge}`}
				>
					{t(`exchanges.status.${exchange.status}`)}
				</span>
			</div>
			<p className="text-sm text-slate-600 leading-relaxed mb-4">
				{t(`exchanges.${slug}.summary`)}
			</p>
			{exchange.leaveDate && (
				<p className="mt-auto text-xs text-slate-500 font-medium">
					{formatDate(exchange.leaveDate, i18n.language)}
				</p>
			)}
		</div>
	);
}

export function ExchangesSection(): JSX.Element {
	const { t } = useTranslation();

	return (
		<section id="tozsdek" className="bg-slate-50 py-16 sm:py-20">
			<div className="mx-auto max-w-4xl px-4 sm:px-6">
				<h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
					{t("exchanges.title")}
				</h2>
				<p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
					{t("exchanges.description")}
				</p>

				<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{sortedExchanges.map(({ slug, exchange }) => (
						<ExchangeCard key={slug} slug={slug} exchange={exchange} />
					))}
				</div>
			</div>
		</section>
	);
}
