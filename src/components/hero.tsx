import type {JSX} from "react";
import {useTranslation} from "react-i18next";
import {exchanges, type ExchangeStatus} from "../data/exchanges.ts";

function countByStatus(status: ExchangeStatus): number {
	return Object.values(exchanges).filter((e) => e.status === status).length;
}

const exchangeCounts = {
	operating: countByStatus("operating"),
	leaving: countByStatus("leaving"),
	unknown: countByStatus("unknown"),
} as const;

const colorClasses = {
	green: "text-emerald-400",
	red: "text-red-400",
	orange: "text-amber-400",
} as const;

const icons = {
	green: "✅",
	red: "🚨",
	orange: "⚠️",
} as const;

interface StatBoxProps {
	count: number;
	labelKey: string;
	color: "green" | "red" | "orange";
}

function StatBox({count, labelKey, color}: StatBoxProps): JSX.Element {
	const {t} = useTranslation();

	return (
		<div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center min-w-[140px]">
			<div className="relative">
				<span className={`absolute -top-1 -right-1 text-sm ${colorClasses[color]}`}>
					{icons[color]}
				</span>
				<div className={`text-5xl font-bold ${colorClasses[color]}`}>{count}</div>
			</div>
			<div className="mt-2 text-sm text-white/90 uppercase tracking-wide font-medium">
				{t(labelKey)}
			</div>
		</div>
	);
}

export function Hero(): JSX.Element {
	const {t} = useTranslation();

	return (
		<section id="attekintes" className="bg-brand text-white py-16 sm:py-24">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
				<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
					{t("hero.title")}
				</h1>
				<p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
					{t("hero.description")}
				</p>

				<div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
					<StatBox
						count={exchangeCounts.operating}
						labelKey="hero.operating"
						color="green"
					/>
					<StatBox count={exchangeCounts.leaving} labelKey="hero.leaving" color="red" />
					<StatBox
						count={exchangeCounts.unknown}
						labelKey="hero.unknown"
						color="orange"
					/>
				</div>

				<div className="mt-10 flex flex-wrap justify-center gap-4">
					<a
						href="#idovonal"
						className="inline-flex items-center px-6 py-3 bg-white text-brand font-semibold rounded-lg hover:bg-white/90 transition-colors"
					>
						{t("hero.cta_timeline")}
					</a>
				</div>
			</div>
		</section>
	);
}
