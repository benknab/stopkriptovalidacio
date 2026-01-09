import type { JSX } from "preact";
import { type SupportedLanguage, t } from "../i18n/index.ts";
import { H2 } from "./h2.tsx";

type CardKey =
	| "zero_compliant"
	| "stricter_than_mica"
	| "criminal"
	| "unique_validator"
	| "private_monopoly"
	| "individual_punishment";

const cardIcons: Record<CardKey, string> = {
	"zero_compliant": "0️⃣",
	"stricter_than_mica": "🇪🇺",
	"criminal": "⚖️",
	"unique_validator": "🔍",
	"private_monopoly": "🏢",
	"individual_punishment": "👤",
};

const cardKeys: CardKey[] = [
	"zero_compliant",
	"criminal",
	"individual_punishment",
	"stricter_than_mica",
	"unique_validator",
	"private_monopoly",
];

interface ImpactCardProps {
	cardKey: CardKey;
	lang: SupportedLanguage;
}

function ImpactCard({ cardKey, lang }: ImpactCardProps): JSX.Element {
	return (
		<div class="bg-white rounded-xl border border-slate-200 p-6 text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
			<div class="text-4xl mb-4">{cardIcons[cardKey]}</div>
			<h3 class="font-semibold text-slate-900 mb-2">
				{t(`impact.cards.${cardKey}.title`, lang)}
			</h3>
			<p class="text-sm text-slate-600 leading-relaxed">
				{t(`impact.cards.${cardKey}.description`, lang)}
			</p>
		</div>
	);
}

interface ImpactSectionProps {
	lang: SupportedLanguage;
}

export function ImpactSection({ lang }: ImpactSectionProps): JSX.Element {
	return (
		<section id="hatassok" class="bg-white py-16 sm:py-20">
			<div class="mx-auto max-w-6xl px-4 sm:px-6">
				<H2>{t("impact.title", lang)}</H2>
				<p class="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
					{t("impact.description", lang)}
				</p>

				<div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{cardKeys.map((key) => <ImpactCard key={key} cardKey={key} lang={lang} />)}
				</div>
			</div>
		</section>
	);
}
