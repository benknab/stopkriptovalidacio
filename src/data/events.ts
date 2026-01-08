import type { TimelineEvents } from "./types.ts";

export const events: TimelineEvents = {
	"t-11922-benyujtva": {
		date: new Date("2025-05-13"),
		type: "primary",
		title: {
			hu: "T/11922 Benyújtva",
			en: "T/11922 Submitted",
		},
		summary: {
			hu: "Magyarország versenyképességének javítása érdekében egyes törvények módosításáról. A kriptovalidáció még nem szerepel ebben a verzióban.",
			en: "Amendment of certain laws to improve Hungary's competitiveness. Crypto validation not yet included in this version.",
		},
		sourceSlugs: new Set(["parlament-11922", "parlament-11922-oldal"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-13-modosito": {
		date: new Date("2025-05-20"),
		type: "primary",
		title: {
			hu: "T/11922/13 Módosító javaslat - Kriptovalidáció első megjelenése",
			en: "T/11922/13 Amendment - First appearance of crypto validation",
		},
		summary: {
			hu: "A kriptovalidátor kifejezés először jelenik meg a módosító javaslatban.",
			en: "The term 'crypto validator' first appears in the amendment.",
		},
		sourceSlugs: new Set(["parlament-11922-13"]),
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
};
