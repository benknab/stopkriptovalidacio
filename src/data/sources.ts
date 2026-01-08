import type { TextI18n } from "./types.ts";

export type Source = {
	title: string;
	originalUrl: string;
	archivedUrl?: string;
	summary?: TextI18n;
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
	"revolut-24hu-2025-07-04": {
		title: "24.hu",
		originalUrl: "https://24.hu/fn/gazdasag/2025/07/04/revolut-kriptovaluta-szolgaltatas-szunetel-magyarorszagon/",
		summary: {
			hu: "A Revolut azonnali hatállyal szüneteltette kriptovaluta-szolgáltatásait Magyarországon. A közelmúltbeli jogszabályváltozások miatt vételi megbízások, staking és befizetések nem lehetségesek, de az eladás és külső pénztárcába utalás továbbra is elérhető.",
			en: "Revolut suspended cryptocurrency services in Hungary with immediate effect. Due to recent legislative changes, buy orders, staking, and deposits are unavailable, but selling and transfers to external wallets remain possible.",
		},
	},
	"revolut-telex-2025-07-09": {
		title: "Telex",
		originalUrl: "https://telex.hu/gazdasag/2025/07/09/kriptopiac-revolut-bitcoin-befektetes-megtakaritas",
		summary: {
			hu: "2025. július 2-án hatályba lépett szabályozás értelmében a kriptovaluta-kereskedelem engedélykötelessé vált Magyarországon. A Revolut ezt követően felfüggesztette szolgáltatásait, több százezer magyar ügyfél nem férhetett hozzá kriptoeszközeihez.",
			en: "Following regulations effective July 2, 2025, cryptocurrency trading became subject to licensing in Hungary. Revolut subsequently suspended its services, leaving hundreds of thousands of Hungarian customers without access to their crypto assets.",
		},
	},
	"revolut-telex-2025-12-08": {
		title: "Telex",
		originalUrl: "https://telex.hu/gazdasag/2025/12/08/revolut-kripto-szolgaltatas-magyarorszag-kivonul",
		summary: {
			hu: "A Revolut 2025. december 8-án bejelentette kriptovaluta-szolgáltatásainak teljes megszüntetését Magyarországon. Az ügyfeleknek december 18-ig kellett rendelkezniük kriptoeszközeikről, ezt követően automatikus értékesítés és számla lezárás következett.",
			en: "Revolut announced the complete termination of cryptocurrency services in Hungary on December 8, 2025. Customers had until December 18 to manage their crypto assets, after which automatic liquidation and account closure followed.",
		},
	},
	"revolut-help-hu": {
		title: "Revolut Súgó",
		originalUrl: "https://help.revolut.com/hu-HU/help/crypto/question-crypto-hungary-pausing-services-retail/",
		summary: {
			hu: "A Revolut hivatalos tájékoztatója a kriptovaluta-szolgáltatások leállításáról a magyar jogszabályi változások miatt. Határidők: staking megszüntetése december 10., kriptó eladása december 18., átváltás befejezése december 25.",
			en: "Official Revolut announcement about termination of crypto services due to Hungarian legislative changes. Deadlines: unstaking December 10, crypto sales December 18, conversion complete December 25.",
		},
	},
	"revolut-24hu-2025-12-08": {
		title: "24.hu",
		originalUrl: "https://24.hu/tech/2025/12/08/kripto-megszunes-revolut-magyarorszag/",
		summary: {
			hu: "A Revolut teljesen beszünteti kriptovaluta-szolgáltatásait Magyarországon. Az ügyfelek december 18-ig eladhatják vagy külső pénztárcába utalhatják kriptoeszközeiket, a staking december 10-én automatikusan megszűnik.",
			en: "Revolut completely terminates cryptocurrency services in Hungary. Customers can sell or transfer crypto to external wallets until December 18; staking ends automatically on December 10.",
		},
	},
	"etoro-portfolio-2025-12-19": {
		title: "Portfolio.hu",
		originalUrl:
			"https://www.portfolio.hu/uzlet/20251219/felfuggeszti-kriptoszolgaltatasait-magyarorszagon-az-etoro-mutatjuk-meddig-tudsz-meg-adni-es-venni-807122",
		summary: {
			hu: "Az eToro bejelentette, hogy 2025. december 26-tól felfüggeszti a hagyományos kriptovaluta-kereskedést Magyarországon. A kripto CFD-k továbbra is elérhetők maradnak.",
			en: "eToro announced that it will suspend traditional cryptocurrency trading in Hungary from December 26, 2025. Crypto CFDs will remain available.",
		},
	},
	"etoro-vg-2025-12-18": {
		title: "VG",
		originalUrl:
			"https://www.vg.hu/penz-es-tokepiac/2025/12/etoro-kriptokereskedelem-kivonulas-magyarorszag-revolut",
		summary: {
			hu: "A VG beszámolója az eToro magyarországi kriptokereskedelem megszüntetéséről a szigorodó hazai szabályozás miatt.",
			en: "VG report on eToro's termination of cryptocurrency trading in Hungary due to stricter domestic regulations.",
		},
	},
	"coincash-blog-2025-07-08": {
		title: "CoinCash Blog",
		originalUrl: "https://coincash.eu/hu/blog/tovabbra-is-zavartalanul-mukodunk",
		summary: {
			hu: "A CoinCash közleménye szerint a regisztráció szünetel, de a meglévő ügyfelek továbbra is használhatják a webes váltási szolgáltatást.",
			en: "According to CoinCash's announcement, registration is suspended, but existing customers can continue to use the web exchange service.",
		},
	},
	"coincash-telex-2025-07-08": {
		title: "Telex",
		originalUrl: "https://telex.hu/gazdasag/2025/07/08/kriptopiac-revolut-bitcoin-befektetes-megtakaritas",
		summary: {
			hu: "A Telex beszámolója a CoinCash közleményéről: a webes váltás elérhető maradt, miközben a regisztráció szünetelt.",
			en: "Telex report on CoinCash's announcement: web exchange remained available while registration was suspended.",
		},
	},
	"coincash-blog-2025-12-17": {
		title: "CoinCash Blog",
		originalUrl: "https://coincash.eu/hu/blog/ideiglenesen-felfuggeszti-a-szolgaltatasait-a-coincash",
		summary: {
			hu: "A CoinCash bejelentette, hogy 2025. december 18-tól ideiglenesen felfüggeszti szolgáltatásait. Új váltási megbízás nem adható le.",
			en: "CoinCash announced temporary suspension of services from December 18, 2025. New exchange orders cannot be placed.",
		},
	},
	"coincash-telex-2025-12-18": {
		title: "Telex",
		originalUrl:
			"https://telex.hu/gazdasag/2025/12/18/coincash-kivonul-magyarorszagrol-kriptovaluta-kozvetito-revolut-szabalyozas",
		summary: {
			hu: "A Telex összefoglalója: a Revolut után a CoinCash is leállítja kriptós szolgáltatásait Magyarországon.",
			en: "Telex summary: after Revolut, CoinCash also suspends crypto services in Hungary.",
		},
	},
	"coincash-portfolio-2025-12-18": {
		title: "Portfolio.hu",
		originalUrl:
			"https://www.portfolio.hu/befektetes/20251218/breking-ma-nemcsak-a-revolut-de-a-coincash-is-felfuggeszti-kriptoszolgaltatasait-magyarorszagon-806822",
		summary: {
			hu: "A Portfolio beszámolója a CoinCash magyarországi kriptoszolgáltatásainak felfüggesztéséről.",
			en: "Portfolio report on CoinCash's suspension of cryptocurrency services in Hungary.",
		},
	},
	"coincash-hvg-2025-12-18": {
		title: "HVG",
		originalUrl: "https://hvg.hu/kkv/20251218_Felfuggesztes-magyar-kripto-CoinCash",
		summary: {
			hu: "A HVG összefoglalója a CoinCash szolgáltatásainak felfüggesztéséről.",
			en: "HVG summary on the suspension of CoinCash services.",
		},
	},
	"bitstamp-kriptoakademia-2025-07-09": {
		title: "KriptoAkadémia",
		originalUrl:
			"https://kriptoakademia.com/2025/07/09/a-revolut-utan-a-bitstamp-is-felfuggesztette-a-kriptokereskedest-magyarorszagon",
		summary: {
			hu: "A Revolut után a Bitstamp is felfüggesztette a kriptokereskedést Magyarországon a szabályozási változások miatt.",
			en: "After Revolut, Bitstamp also suspended cryptocurrency trading in Hungary due to regulatory changes.",
		},
	},
	"bitstamp-cryptofalka-2025-07-09": {
		title: "CryptoFalka",
		originalUrl: "https://cryptofalka.hu/tozsde/revolut-utan-bitstamp-szunetelteti-szolgaltatasat-magyarorszagon",
		summary: {
			hu: "A CryptoFalka beszámolója a Bitstamp magyarországi szolgáltatáskorlátozásáról a jogszabályváltozás miatt.",
			en: "CryptoFalka report on Bitstamp's service restrictions in Hungary due to legislative changes.",
		},
	},
	"bitstamp-origo-2025-07": {
		title: "Origo",
		originalUrl: "https://www.origo.hu/gazdasag/2025/07/bitstamp-revolut-kriptovaluta-szolgaltatas",
		summary: {
			hu: "A Bitstamp leállította a digitális eszközök vételét és eladását magyar ügyfeleknek. A befizetés, kiutalás, staking és kölcsönzés továbbra is elérhető maradt.",
			en: "Bitstamp suspended buying and selling of digital assets for Hungarian customers. Deposits, withdrawals, staking, and lending remained available.",
		},
	},
	"kriptomat-official-2025-12-22": {
		title: "Kriptomat",
		originalUrl: "https://kriptomat.io/temporary-suspension-of-trading-services-in-hungary/",
		summary: {
			hu: "A Kriptomat hivatalos közleménye: 2025. december 26-tól 23:00-tól ideiglenesen felfüggesztik a kereskedési szolgáltatásokat Magyarországon. A vétel, eladás, váltás, KriptoEarn és Intelligent Portfolios szünetel, de a kifizetések elérhetők maradnak.",
			en: "Official Kriptomat announcement: trading services temporarily suspended in Hungary from December 26, 2025 at 23:00 CET. Buy, sell, exchange, KriptoEarn, and Intelligent Portfolios paused, but withdrawals remain available.",
		},
	},
	"kriptomat-index-2025-12-25": {
		title: "Index.hu",
		originalUrl:
			"https://index.hu/gazdasag/2025/12/25/kriptopiac-kriptomat-kivonulas-magyarorszag-revolut-szabalyozas",
		summary: {
			hu: "Az Index beszámolója a Kriptomat magyarországi szolgáltatásainak felfüggesztéséről december 26-tól a szigorodó szabályozási környezet miatt.",
			en: "Index report on Kriptomat's suspension of Hungarian services from December 26 due to stricter regulatory environment.",
		},
	},
	"kriptomat-revb-2025-12-24": {
		title: "RevB.hu",
		originalUrl: "https://revb.hu/karacsonyi-sokk-a-magyar-kriptopiacon-a-kriptomat-is-bedobja-a-torolkozot/",
		summary: {
			hu: "A RevB beszámolója: a Kriptomat is felfüggeszti magyarországi szolgáltatásait december 26-tól, annak ellenére, hogy december 19-én elindult az első validátor.",
			en: "RevB report: Kriptomat also suspends Hungarian services from December 26, despite the first validator launching on December 19.",
		},
	},
	"kriptomat-privatbankar-2025-12-25": {
		title: "Privátbankár.hu",
		originalUrl:
			"https://privatbankar.hu/cikkek/vallalat/eros-kritika-nagy-martoneknak-a-kriptoceg-labbal-szavaz.html",
		summary: {
			hu: "A Privátbankár beszámolója a Kriptomat magyarországi szolgáltatásainak felfüggesztéséről december 26-tól 23:00-tól.",
			en: "Privátbankár report on Kriptomat's suspension of Hungarian services from December 26 at 23:00 CET.",
		},
	},
} as const;

export type SourceSlug = keyof typeof sources;
