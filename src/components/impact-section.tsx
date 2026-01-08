import type { JSX } from "react";
import { useTranslation } from "react-i18next";

type CardKey =
	| "zero_compliant"
	| "stricter_than_mica"
	| "criminal"
	| "unique_validator"
	| "private_monopoly"
	| "individual_punishment";

const cardIcons: Record<CardKey, string> = {
	zero_compliant: "0️⃣",
	stricter_than_mica: "🇪🇺",
	criminal: "⚖️",
	unique_validator: "🔍",
	private_monopoly: "🏢",
	individual_punishment: "👤",
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
}

function ImpactCard({ cardKey }: ImpactCardProps): JSX.Element {
	const { t } = useTranslation();

	return (
		<div className="bg-white rounded-xl border border-slate-200 p-6 text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
			<div className="text-4xl mb-4">{cardIcons[cardKey]}</div>
			<h3 className="font-semibold text-slate-900 mb-2">
				{t(`impact.cards.${cardKey}.title`)}
			</h3>
			<p className="text-sm text-slate-600 leading-relaxed">
				{t(`impact.cards.${cardKey}.description`)}
			</p>
		</div>
	);
}

export function ImpactSection(): JSX.Element {
	const { t } = useTranslation();

	return (
		<section id="hatassok" className="bg-white py-16 sm:py-20">
			<div className="mx-auto max-w-4xl px-4 sm:px-6">
				<h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
					{t("impact.title")}
				</h2>
				<p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
					{t("impact.description")}
				</p>

				<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{cardKeys.map((key) => <ImpactCard key={key} cardKey={key} />)}
				</div>
			</div>
		</section>
	);
}
