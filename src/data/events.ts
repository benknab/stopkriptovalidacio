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
	"telex-kripto-kriptodeviza-bitcoin-revolut-btk": {
		date: new Date("2025-07-01"),
		type: "secondary",
		title: {
			hu: "telex-kripto-kriptodeviza-bitcoin-revolut-btk",
			en: "telex-kripto-kriptodeviza-bitcoin-revolut-btk",
		},
		summary: {
			hu: "telex-kripto-kriptodeviza-bitcoin-revolut-btk",
			en: "telex-kripto-kriptodeviza-bitcoin-revolut-btk",
		},
		sourceSlugs: new Set(["telex-kripto-btk"]),
		exchangeSlugs: new Set(["revolut"]),
	},
	"telex-revolut-mica-engedely-kriptovaluta": {
		date: new Date("2025-10-23"),
		type: "secondary",
		title: {
			hu: "telex-revolut-mica-engedely-kriptovaluta",
			en: "telex-revolut-mica-engedely-kriptovaluta",
		},
		summary: {
			hu: "telex-revolut-mica-engedely-kriptovaluta",
			en: "telex-revolut-mica-engedely-kriptovaluta",
		},
		sourceSlugs: new Set(["telex-revolut-mica"]),
		exchangeSlugs: new Set(["revolut"]),
	},
};
