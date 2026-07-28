import type { JSX } from "preact";
import { TELEGRAM_CHANNEL_URL } from "../constants/seo.ts";
import { exchanges, type ExchangeStatus } from "../data/exchanges.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { ButtonLink } from "./button-link.tsx";

function countByStatus(status: ExchangeStatus): number {
	return Object.values(exchanges).filter((e) => e.status === status).length;
}

const exchangeCounts = {
	restricted: countByStatus("restricted"),
	returnedOrReturning: Object.values(exchanges).filter((exchange) => exchange.returnStatus !== undefined).length,
} as const;

const colorClasses = {
	green: "text-emerald-400",
	red: "text-red-400",
} as const;

interface StatBoxProps {
	count: number;
	label: string;
	color: keyof typeof colorClasses;
}

function StatBox({ count, label, color }: StatBoxProps): JSX.Element {
	return (
		<div class="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
			<div class={`text-5xl font-bold ${colorClasses[color]}`}>{count}</div>
			<div class="mt-2 text-xs sm:text-sm text-white/90 uppercase tracking-wide font-medium">
				{label}
			</div>
		</div>
	);
}

interface HeroProps {
	lang: SupportedLanguage;
}

export function Hero({ lang }: HeroProps): JSX.Element {
	return (
		<section id="attekintes" class="bg-brand text-white pt-12 pb-16 sm:pt-16 sm:pb-24">
			<div class="mx-auto max-w-6xl px-4 sm:px-6 text-center">
				<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl mx-auto">
					{t("hero.title", lang)}
				</h1>
				<p class="mt-6 text-lg sm:text-xl text-white/80 max-w-4xl mx-auto flex flex-col gap-3">
					<span>
						{t("hero.description_line_1_before", lang)}
						<a
							href="/kriptovalidalas"
							class="underline decoration-white/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
						>
							{t("hero.description_link", lang)}
						</a>
						{t("hero.description_line_1_after", lang)}
					</span>
					<span>{t("hero.description_line_2", lang)}</span>
					<strong class="text-white">{t("hero.description_line_3", lang)}</strong>
				</p>

				<div class="mt-8 bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 sm:p-8 text-left max-w-3xl mx-auto">
					<h2 class="text-xl sm:text-2xl font-bold mb-4 text-center">
						{t("hero.tracking.title", lang)}
					</h2>
					<p class="text-white/90 leading-relaxed">
						{t("hero.tracking.description", lang)}
					</p>
				</div>

				<div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
					<StatBox count={exchangeCounts.restricted} label={t("hero.restricted", lang)} color="red" />
					<StatBox
						count={exchangeCounts.returnedOrReturning}
						label={t("hero.returned_or_returning", lang)}
						color="green"
					/>
				</div>

				<div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
					<ButtonLink href="#tozsdek">
						{t("hero.cta_exchanges", lang)}
					</ButtonLink>
					<ButtonLink href="#idovonal" variant="secondary">
						{t("hero.cta_timeline", lang)}
					</ButtonLink>
					<ButtonLink href={TELEGRAM_CHANNEL_URL} variant="secondary" external>
						{t("hero.cta_telegram", lang)}
					</ButtonLink>
				</div>
			</div>
		</section>
	);
}
