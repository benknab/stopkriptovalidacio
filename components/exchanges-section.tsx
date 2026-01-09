import type { JSX } from "preact";
import { type Exchange, exchanges, type ExchangeSlug, type ExchangeStatus } from "../data/exchanges.ts";
import { t, type SupportedLanguage } from "../i18n/index.ts";
import { H2 } from "./h2.tsx";

const statusPriority: Record<ExchangeStatus, number> = {
	operating: 0,
	restricted: 1,
	uncertain: 2,
};

const statusColors: Record<ExchangeStatus, { border: string; badge: string }> = {
	operating: {
		border: "border-t-emerald-500",
		badge: "bg-emerald-100 text-emerald-700",
	},
	restricted: {
		border: "border-t-red-500",
		badge: "bg-red-100 text-red-700",
	},
	uncertain: {
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
	lang: SupportedLanguage;
}

function formatDate(date: Date, lang: SupportedLanguage): string {
	return date.toLocaleDateString(lang === "hu" ? "hu-HU" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function ExchangeCard({ slug, exchange, lang }: ExchangeCardProps): JSX.Element {
	const colors = statusColors[exchange.status];

	return (
		<div
			class={`bg-white rounded-xl border border-slate-200 border-t-4 ${colors.border} p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full`}
		>
			<div class="flex justify-between items-start gap-3 mb-2">
				<h3 class="font-semibold text-slate-900">{exchange.name}</h3>
				<span
					class={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${colors.badge}`}
				>
					{t(`exchanges.status.${exchange.status}`, lang)}
				</span>
			</div>
			<p class="text-sm text-slate-600 leading-relaxed mb-4">
				{t(`exchanges.${slug}.summary`, lang)}
			</p>
			{exchange.leaveDate && (
				<p class="mt-auto text-xs text-slate-500 font-medium">
					{formatDate(exchange.leaveDate, lang)}
				</p>
			)}
		</div>
	);
}

interface ExchangesSectionProps {
	lang: SupportedLanguage;
}

export function ExchangesSection({ lang }: ExchangesSectionProps): JSX.Element {
	return (
		<section id="tozsdek" class="bg-slate-50 py-16 sm:py-20">
			<div class="mx-auto max-w-6xl px-4 sm:px-6">
				<H2>{t("exchanges.title", lang)}</H2>
				<p class="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
					{t("exchanges.description", lang)}
				</p>

				<div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{sortedExchanges.map(({ slug, exchange }) => (
						<ExchangeCard key={slug} slug={slug} exchange={exchange} lang={lang} />
					))}
				</div>
			</div>
		</section>
	);
}
