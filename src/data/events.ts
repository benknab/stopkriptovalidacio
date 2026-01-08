import type { TimelineEvents } from "./types.ts";

export const events: TimelineEvents = {
	"t-11922-benyujtva": {
		date: new Date("2025-05-13"),
		type: "primary",
		title: {
			hu: "T/11922 törvényjavaslat benyújtása",
			en: "T/11922 bill submitted",
		},
		summary: {
			hu: "A Kormány benyújtotta a Magyarország versenyképességének javítása érdekében egyes törvények módosításáról szóló törvényjavaslatot. A kriptoeszköz-átváltást validáló szolgáltatásra vonatkozó szabályozás még nem szerepel ebben a változatban.",
			en: "The Government submitted a bill on the amendment of certain laws to improve Hungary's competitiveness. Regulations on crypto-asset exchange validation services are not yet included in this version.",
		},
		sourceSlugs: new Set(["parlament-11922", "parlament-11922-oldal"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-13-egysegesirasba": {
		date: new Date("2025-06-10"),
		type: "primary",
		title: {
			hu: "T/11922/13 egységes javaslat benyújtása",
			en: "T/11922/13 unified proposal submitted",
		},
		summary: {
			hu: "A Törvényalkotási Bizottság benyújtotta a túlterjeszkedő módosító javaslatot tartalmazó egységes javaslatot. A dokumentum első alkalommal tartalmazza a kriptoeszköz-átváltást validáló szolgáltatásra és a kriptoeszközzel visszaélés bűncselekményére vonatkozó rendelkezéseket.",
			en: "The Legislation Committee submitted the unified proposal containing overreaching amendments. The document contains provisions on crypto-asset exchange validation services and the criminal offense of crypto-asset abuse for the first time.",
		},
		sourceSlugs: new Set(["parlament-11922-13", "parlament-11922-oldal"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-ind03": {
		date: new Date("2025-06-10"),
		type: "primary",
		title: {
			hu: "T/11922 egységes javaslat indokolásának közzététele",
			en: "T/11922 unified proposal explanatory memorandum published",
		},
		summary: {
			hu: "Az egységes javaslathoz készített előterjesztői indokolás részletezi a kriptoeszközzel visszaélés bűncselekményi tényállását (Btk. 408/A. §), valamint a kriptoeszköz-átváltást validáló szolgáltatókra vonatkozó követelményeket.",
			en: "The explanatory memorandum for the unified proposal details the criminal offense of crypto-asset abuse (Criminal Code Section 408/A) and requirements for crypto-asset exchange validation service providers.",
		},
		sourceSlugs: new Set(["parlament-11922-ind03", "parlament-11922-oldal"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-ind05": {
		date: new Date("2025-06-17"),
		type: "secondary",
		title: {
			hu: "T/11922 elfogadott törvény indokolásának közzététele",
			en: "T/11922 adopted law explanatory memorandum published",
		},
		summary: {
			hu: "Az elfogadott törvényhez készített előterjesztői indokolás megjelent az Indokolások Tárában. A kriptoeszközökre vonatkozó rendelkezések változatlanok maradtak.",
			en: "The explanatory memorandum for the adopted law was published in the Indokolások Tára. Provisions on crypto-assets remained unchanged.",
		},
		sourceSlugs: new Set(["parlament-11922-ind05", "parlament-11922-oldal"]),
		exchangeSlugs: new Set(),
	},
	"revolut-korlatozas-kezdete": {
		date: new Date("2025-07-04"),
		type: "secondary",
		title: {
			hu: "Revolut kriptovaluta-korlátozások kezdete",
			en: "Revolut cryptocurrency restrictions begin",
		},
		summary: {
			hu: "A Revolut értesítette magyar ügyfeleit a kriptovaluta-szolgáltatások részleges szüneteltetéséről. A vételi megbízások, staking indítása és befizetések nem voltak elérhetők.",
			en: "Revolut notified Hungarian customers about partial suspension of cryptocurrency services. Buy orders, staking initiation, and deposits were unavailable.",
		},
		sourceSlugs: new Set(["revolut-24hu-2025-07-04"]),
		exchangeSlugs: new Set(["revolut"]),
	},
	"revolut-befagyasztas": {
		date: new Date("2025-07-07"),
		type: "secondary",
		title: {
			hu: "Revolut teljes kriptovaluta-befagyasztás",
			en: "Revolut complete cryptocurrency freeze",
		},
		summary: {
			hu: "A korlátozások a legszigorúbbá váltak: a meglévő ügyfelek kiszolgálása is leállt. Sem vásárlás, sem eladás, sem átutalás nem volt lehetséges.",
			en: "Restrictions reached their strictest level: service to existing customers also stopped. No purchases, sales, or transfers were possible.",
		},
		sourceSlugs: new Set(["revolut-telex-2025-07-09"]),
		exchangeSlugs: new Set(["revolut"]),
	},
	"revolut-kivonulas": {
		date: new Date("2025-12-08"),
		type: "primary",
		title: {
			hu: "Revolut bejelenti a teljes kivonulást",
			en: "Revolut announces complete withdrawal",
		},
		summary: {
			hu: "A Revolut bejelentette kriptovaluta-szolgáltatásainak teljes megszüntetését Magyarországon. December 18-ig lehetett eladni a kriptoeszközöket, ezt követően automatikus értékesítés történt.",
			en: "Revolut announced the complete termination of cryptocurrency services in Hungary. Crypto assets could be sold until December 18, after which automatic liquidation occurred.",
		},
		sourceSlugs: new Set([
			"revolut-telex-2025-12-08",
			"revolut-help-hu",
			"revolut-24hu-2025-12-08",
		]),
		exchangeSlugs: new Set(["revolut"]),
	},
	"strike-kivonulas": {
		date: new Date("2026-01-09"),
		type: "primary",
		title: {
			hu: "Strike bejelenti a magyarországi szolgáltatások korlátozását",
			en: "Strike announces restriction of Hungarian services",
		},
		summary: {
			hu: "A Strike értesítette ügyfeleit, hogy 2026. január 9-től csak EUR és BTC kivétel lesz elérhető Magyarországon. A vásárlás és eladás funkciók megszűnnek.",
			en: "Strike notified customers that starting January 9, 2026, only EUR and BTC withdrawals will be available in Hungary. Buy and sell features will be discontinued.",
		},
		sourceSlugs: new Set(),
		exchangeSlugs: new Set(["strike"]),
	},
	"etoro-bejelentes": {
		date: new Date("2025-12-18"),
		type: "secondary",
		title: {
			hu: "eToro bejelenti a kriptokereskedés felfüggesztését",
			en: "eToro announces suspension of crypto trading",
		},
		summary: {
			hu: "Az eToro bejelentette, hogy december 26-tól megszünteti a hagyományos kriptovaluta vásárlást és eladást Magyarországon. A kripto CFD-k továbbra is elérhetők maradnak.",
			en: "eToro announced that it will discontinue traditional cryptocurrency buying and selling in Hungary from December 26. Crypto CFDs will remain available.",
		},
		sourceSlugs: new Set(["etoro-portfolio-2025-12-19", "etoro-vg-2025-12-18"]),
		exchangeSlugs: new Set(["etoro"]),
	},
	"etoro-kivonulas": {
		date: new Date("2025-12-26"),
		type: "primary",
		title: {
			hu: "eToro kriptokereskedés megszűnése Magyarországon",
			en: "eToro crypto trading ends in Hungary",
		},
		summary: {
			hu: "Az eToro-nál megszűnt a hagyományos kriptovaluta-kereskedés Magyarországon. A felhasználók lezárhatták pozícióikat, ezt követően csak kripto CFD-k maradtak elérhetők.",
			en: "Traditional cryptocurrency trading ended at eToro in Hungary. Users could close their positions, after which only crypto CFDs remained available.",
		},
		sourceSlugs: new Set(["etoro-portfolio-2025-12-19"]),
		exchangeSlugs: new Set(["etoro"]),
	},
	"coincash-regisztracio-szunetel": {
		date: new Date("2025-07-08"),
		type: "secondary",
		title: {
			hu: "CoinCash regisztráció szünetel",
			en: "CoinCash registration suspended",
		},
		summary: {
			hu: "A CoinCash felfüggesztette az új regisztrációkat, de a meglévő ügyfelek továbbra is használhatták a webes váltási szolgáltatást.",
			en: "CoinCash suspended new registrations, but existing customers could continue using the web exchange service.",
		},
		sourceSlugs: new Set(["coincash-blog-2025-07-08", "coincash-telex-2025-07-08"]),
		exchangeSlugs: new Set(["coincash"]),
	},
	"coincash-felfuggesztes": {
		date: new Date("2025-12-18"),
		type: "primary",
		title: {
			hu: "CoinCash szolgáltatások ideiglenes felfüggesztése",
			en: "CoinCash services temporarily suspended",
		},
		summary: {
			hu: "A CoinCash ideiglenesen felfüggesztette szolgáltatásait Magyarországon. Új váltási megbízás nem adható le a felületeken.",
			en: "CoinCash temporarily suspended services in Hungary. New exchange orders cannot be placed on the platforms.",
		},
		sourceSlugs: new Set([
			"coincash-blog-2025-12-17",
			"coincash-telex-2025-12-18",
			"coincash-portfolio-2025-12-18",
			"coincash-hvg-2025-12-18",
		]),
		exchangeSlugs: new Set(["coincash"]),
	},
	"bitstamp-kereskedes-felfuggesztve": {
		date: new Date("2025-07-09"),
		type: "primary",
		title: {
			hu: "Bitstamp felfüggeszti a kriptokereskedést Magyarországon",
			en: "Bitstamp suspends crypto trading in Hungary",
		},
		summary: {
			hu: "A Bitstamp felfüggesztette a kriptoeszközök vételét és eladását magyar ügyfelek számára. A befizetés, kiutalás, staking és kölcsönzés ideiglenesen elérhető maradt.",
			en: "Bitstamp suspended buying and selling of crypto assets for Hungarian customers. Deposits, withdrawals, staking, and lending temporarily remained available.",
		},
		sourceSlugs: new Set([
			"bitstamp-kriptoakademia-2025-07-09",
			"bitstamp-cryptofalka-2025-07-09",
			"bitstamp-origo-2025-07",
		]),
		exchangeSlugs: new Set(["bitstamp"]),
	},
	"kriptomat-felfuggesztes": {
		date: new Date("2025-12-26"),
		type: "primary",
		title: {
			hu: "Kriptomat felfüggeszti kereskedési szolgáltatásait Magyarországon",
			en: "Kriptomat suspends trading services in Hungary",
		},
		summary: {
			hu: "A Kriptomat ideiglenesen felfüggesztette kereskedési szolgáltatásait Magyarországon december 26-tól 23:00-tól. A vétel, eladás, váltás, KriptoEarn és Intelligent Portfolios szünetel, de a kifizetések elérhetők maradnak.",
			en: "Kriptomat temporarily suspended trading services in Hungary from December 26 at 23:00 CET. Buy, sell, exchange, KriptoEarn, and Intelligent Portfolios paused, but withdrawals remain available.",
		},
		sourceSlugs: new Set([
			"kriptomat-official-2025-12-22",
			"kriptomat-index-2025-12-25",
			"kriptomat-revb-2025-12-24",
			"kriptomat-privatbankar-2025-12-25",
		]),
		exchangeSlugs: new Set(["kriptomat"]),
	},
};
