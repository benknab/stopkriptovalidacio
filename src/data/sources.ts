export type Source = {
	title: string;
	originalUrl: string;
	archivedUrl?: string;
};

export const sources = {
	"parlament-11922": {
		title: "Eredeti dokumentum (PDF)",
		originalUrl: "https://www.parlament.hu/irom42/11922/11922.pdf",
		archivedUrl: "/archivum/11922.pdf",
	},
	"parlament-11922-oldal": {
		title: "Parlament.hu",
		originalUrl:
			"https://www.parlament.hu/web/guest/szavazasok-adott-idoszakban?p_p_id=hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_auth=yn2Czm3g&_hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8_pairAction=%2Finternet%2Fcplsql%2Fogy_irom.irom_adat%3Fp_ckl%3D42%26p_izon%3D11922",
	},
	"parlament-11922-13": {
		title: "Módosító javaslat (PDF)",
		originalUrl: "https://www.parlament.hu/irom42/11922/11922-0013.pdf",
		archivedUrl: "/archivum/11922-0013.pdf",
	},
	"telex-kripto-btk": {
		title: "Telex",
		originalUrl: "https://telex.hu/gazdasag/2025/07/01/kripto-kriptodeviza-bitcoin-revolut-btk",
	},
	"telex-revolut-mica": {
		title: "Telex",
		originalUrl: "https://telex.hu/gazdasag/2025/10/23/revolut-mica-engedely-kriptovaluta",
	},
} as const;

export type SourceSlug = keyof typeof sources;
