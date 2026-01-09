import type { JSX } from "preact";
import { exchanges, type ExchangeStatus } from "../data/exchanges.ts";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { ButtonLink } from "./button-link.tsx";

function countByStatus(status: ExchangeStatus): number {
	return Object.values(exchanges).filter((e) => e.status === status).length;
}

const exchangeCounts = {
	operating: countByStatus("operating"),
	restricted: countByStatus("restricted"),
	uncertain: countByStatus("uncertain"),
} as const;

const colorClasses = {
	green: "text-emerald-400",
	red: "text-red-400",
	orange: "text-amber-400",
} as const;

interface StatBoxProps {
	count: number;
	label: string;
	color: "green" | "red" | "orange";
}

function StatBox({ count, label, color }: StatBoxProps): JSX.Element {
	return (
		<div class="bg-white/10 backdrop-blur rounded-xl p-6 text-center min-w-[140px]">
			<div class={`text-5xl font-bold ${colorClasses[color]}`}>{count}</div>
			<div class="mt-2 text-sm text-white/90 uppercase tracking-wide font-medium">
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
		<section id="attekintes" class="bg-brand text-white py-16 sm:py-24">
			<div class="mx-auto max-w-6xl px-4 sm:px-6 text-center">
				<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
					{t("hero.title", lang)}
				</h1>
				<p class="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
					{t("hero.description", lang)}
				</p>

				<div class="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
					<StatBox
						count={exchangeCounts.operating}
						label={t("hero.compliant", lang)}
						color="green"
					/>
					<StatBox count={exchangeCounts.restricted} label={t("hero.restricted", lang)} color="red" />
					<StatBox
						count={exchangeCounts.uncertain}
						label={t("hero.uncertain", lang)}
						color="orange"
					/>
				</div>

				<div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
					<ButtonLink href="#cselekedj">
						{t("hero.cta_contact", lang)}
					</ButtonLink>
					<ButtonLink href="#idovonal">
						{t("hero.cta_learn_more", lang)}
					</ButtonLink>
				</div>
			</div>
		</section>
	);
}
