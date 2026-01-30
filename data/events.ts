import type { TimelineEvents } from "./types.ts";

/**
 * Timeline Events
 *
 * Event types:
 * - "primary": Major milestones (always displayed)
 * - "secondary": Exchange actions (togglable via UI)
 * - "tertiary": Supporting documentation (togglable via UI)
 * - "telegram": Telegram-only events (not shown on timeline, links to main page)
 */
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
		sourceSlugs: new Set(["parlament-11922-oldal", "parlament-11922"]),
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
			hu: "A Törvényalkotási Bizottság benyújtotta a túlterjeszkedő módosító javaslatot tartalmazó egységes javaslatot. <b>A dokumentum első alkalommal tartalmazza a kriptoeszköz-átváltást validáló szolgáltatásra és a kriptoeszközzel visszaélés bűncselekményére vonatkozó rendelkezéseket. A törvény nem definiálja a validálás fogalmát.</b>",
			en: "The Legislation Committee submitted the unified proposal containing overreaching amendments. <b>The document contains provisions on crypto-asset exchange validation services and the criminal offense of crypto-asset abuse for the first time. The law does not define what validation means.</b>",
		},
		sourceSlugs: new Set(["parlament-11922-oldal", "parlament-11922-13"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-ind03": {
		date: new Date("2025-06-10"),
		type: "tertiary",
		title: {
			hu: "T/11922 egységes javaslat indokolásának közzététele",
			en: "T/11922 unified proposal explanatory memorandum published",
		},
		summary: {
			hu: "Az egységes javaslathoz készített előterjesztői indokolás részletezi a kriptoeszközzel visszaélés bűncselekményi tényállását (Btk. 408/A. §), valamint a kriptoeszköz-átváltást validáló szolgáltatókra vonatkozó követelményeket.",
			en: "The explanatory memorandum for the unified proposal details the criminal offense of crypto-asset abuse (Criminal Code Section 408/A) and requirements for crypto-asset exchange validation service providers.",
		},
		sourceSlugs: new Set(["parlament-11922-oldal", "parlament-11922-ind03"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-ind05": {
		date: new Date("2025-06-17"),
		type: "tertiary",
		title: {
			hu: "T/11922 elfogadott törvény indokolásának közzététele",
			en: "T/11922 adopted law explanatory memorandum published",
		},
		summary: {
			hu: "Az elfogadott törvényhez készített előterjesztői indokolás megjelent az Indokolások Tárában. A kriptoeszközökre vonatkozó rendelkezések változatlanok maradtak.",
			en: "The explanatory memorandum for the adopted law was published in the Indokolások Tára. Provisions on crypto-assets remained unchanged.",
		},
		sourceSlugs: new Set(["parlament-11922-oldal", "parlament-11922-ind05"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-szavazas": {
		date: new Date("2025-06-17"),
		type: "primary",
		title: {
			hu: "T/11922 törvényjavaslat elfogadása",
			en: "T/11922 bill adopted",
		},
		summary: {
			hu: "<b>Az Országgyűlés rendkívüli ülésén elfogadta a törvényjavaslatot anélkül, hogy bármely módosító javaslat definiálta volna a validálás fogalmát.</b> Minősített többséget igénylő rész: 162 igen, 94 nem (14:39:54). Egyszerű többséget igénylő rész: 162 igen, 94 nem (14:40:29).",
			en: "<b>The National Assembly adopted the bill at an extraordinary session without any amendment defining what validation means.</b> Qualified majority part: 162 yes, 94 no (14:39:54). Simple majority part: 162 yes, 94 no (14:40:29).",
		},
		sourceSlugs: new Set(["parlament-11922-oldal", "parlament-11922-ind05"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-hazelnok-alairas": {
		date: new Date("2025-06-17"),
		type: "tertiary",
		title: {
			hu: "Országgyűlés elnöke aláírta a T/11922 törvényjavaslatot",
			en: "Speaker of the National Assembly signed bill T/11922",
		},
		summary: {
			hu: "Az Országgyűlés elnöke aláírta a Magyarország versenyképességének javítása érdekében egyes törvények módosításáról szóló törvényjavaslatot és megküldte a köztársasági elnöknek.",
			en: "The Speaker of the National Assembly signed the bill on the amendment of certain laws to improve Hungary's competitiveness and sent it to the President of the Republic.",
		},
		sourceSlugs: new Set(["parlament-11922-oldal", "parlament-11922-ind05"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-koztarsasagi-elnok-alairas": {
		date: new Date("2025-06-22"),
		type: "tertiary",
		title: {
			hu: "Köztársasági elnök aláírta a 2025. évi LXVII. törvényt",
			en: "President of the Republic signed Act LXVII of 2025",
		},
		summary: {
			hu: "A köztársasági elnök aláírta a Magyarország versenyképességének javítása érdekében egyes törvények módosításáról szóló törvényt.",
			en: "The President of the Republic signed the Act on the amendment of certain laws to improve Hungary's competitiveness.",
		},
		sourceSlugs: new Set(["parlament-11922-oldal", "parlament-11922-ind05"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-kihirdetes": {
		date: new Date("2025-06-23"),
		type: "tertiary",
		title: {
			hu: "2025. évi LXVII. törvény kihirdetése",
			en: "Act LXVII of 2025 promulgated",
		},
		summary: {
			hu: "A törvény megjelent a Magyar Közlöny 2025/75. számában mint 2025. évi LXVII. törvény Magyarország versenyképességének javítása érdekében egyes törvények módosításáról.",
			en: "The law was published in Magyar Közlöny issue 2025/75 as Act LXVII of 2025 on the amendment of certain laws to improve Hungary's competitiveness.",
		},
		sourceSlugs: new Set(["parlament-11922-oldal", "parlament-11922-ind05"]),
		exchangeSlugs: new Set(),
	},
	"t-11922-hatalyba-lepes": {
		date: new Date("2025-07-01"),
		type: "primary",
		title: {
			hu: "2025. évi LXVII. törvény hatálybalépése",
			en: "Act LXVII of 2025 enters into force",
		},
		summary: {
			hu: "A törvény hatályba lépett. <b>A kriptoeszköz-átváltást validáló szolgáltatásra vonatkozó végrehajtási rendelet az SZTFH részéről ekkor még nem létezett.</b> A törvény 259. §-a szerint a validálási kötelezettség az SZTFH elnöki rendelet hatálybalépését követő 60. naptól alkalmazandó.",
			en: "The law entered into force. <b>The implementing regulation for crypto-asset exchange validation services from SZTFH did not exist at this time.</b> According to Section 259 of the law, the validation requirement applies from the 60th day after the SZTFH presidential decree enters into force.",
		},
		sourceSlugs: new Set([
			"parlament-11922-oldal",
			"parlament-11922-ind03",
			"parlament-11922-ind05",
		]),
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
		type: "tertiary",
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
	"sztfh-rendelet-kihirdetes": {
		date: new Date("2025-10-27"),
		type: "primary",
		title: {
			hu: "Kripto validátor rendelet kihirdetése",
			en: "Crypto validator regulation published",
		},
		summary: {
			hu: "Megjelent a kripto validátor szolgáltatók engedélyezésének és nyilvántartásának részletes szabályairól szóló 10/2025. (X. 27.) SZTFH rendelet. A rendelet a kihirdetést követő 3. napon lép hatályba, alkalmazni a 60. naptól kell. <b>A kripto validálás és validátor fogalma továbbra sincs definiálva.</b>",
			en: "SZTFH Regulation 10/2025 (X. 27.) on detailed rules for licensing and registration of crypto validator service providers was published. The regulation enters into force on the 3rd day after publication, applicable from the 60th day. <b>The terms crypto validation and validator remain undefined.</b>",
		},
		sourceSlugs: new Set(["sztfh-rendelet-10-2025", "sztfh-kozlemeny-2025-10-27"]),
		exchangeSlugs: new Set(),
	},
	"sztfh-rendelet-12-2025-kihirdetes": {
		date: new Date("2025-11-28"),
		type: "tertiary",
		title: {
			hu: "12/2025. (XI. 28.) SZTFH rendelet kihirdetése",
			en: "SZTFH Regulation 12/2025 (XI. 28.) published",
		},
		summary: {
			hu: "Megjelent a kriptoeszköz-átváltást validáló szolgáltató engedélyezésével összefüggő eljárások igazgatási szolgáltatási díjairól szóló rendelet. Az engedélyezési eljárás díja 620 000 Ft. A rendelet a kihirdetést követő 31. napon lép hatályba.",
			en: "The regulation on administrative service fees for crypto-asset exchange validation service provider licensing procedures was published. The licensing fee is 620,000 HUF. The regulation enters into force on the 31st day after publication.",
		},
		sourceSlugs: new Set(["sztfh-rendelet-12-2025"]),
		exchangeSlugs: new Set(),
	},
	"caduceus-alapitas": {
		date: new Date("2025-07-11"),
		type: "tertiary",
		title: {
			hu: "Caduceus Zrt. alapítása",
			en: "Caduceus Zrt. founded",
		},
		summary: {
			hu: "Megalakult a Caduceus Zártkörűen Működő Részvénytársaság 100 millió Ft jegyzett tőkével. Igazgatóság elnöke és többségi tulajdonos: Vesszős Bence Marcell. Igazgatósági tagok: Kollár József és Hatvani Andrea. <b>A vezetőségnek nincs ismert kriptovaluta- vagy pénzügyi szektorbeli tapasztalata.</b> Az elnök testvére, Vesszős Gergely, a NAV Bűnügyi Főigazgatóságának egykori munkatársa, aki a virtuális fizetőeszközök szabályozásában vett részt.",
			en: "Caduceus Private Limited Company was founded with 100 million HUF registered capital. Chairman and majority owner: Bence Marcell Vesszős. Board members: József Kollár and Andrea Hatvani. <b>The leadership has no known cryptocurrency or financial sector experience.</b> The chairman's brother, Gergely Vesszős, is a former employee of NAV's Criminal Directorate who worked on virtual currency regulation.",
		},
		sourceSlugs: new Set([
			"caduceus-cegkivonat",
			"caduceus-cegbetekintes",
			"caduceus-cegkozlony",
			"bitcoinbazis-caduceus",
		]),
		exchangeSlugs: new Set(),
	},
	"caduceus-bejegyzes": {
		date: new Date("2025-07-25"),
		type: "tertiary",
		title: {
			hu: "Caduceus Zrt. cégbejegyzése",
			en: "Caduceus Zrt. company registration",
		},
		summary: {
			hu: "A Caduceus Zrt.-t bejegyezték a cégnyilvántartásba. A cég a bejegyzés előtt ismeretlen volt a kriptovaluta-iparágban: nem volt jelen helyi kriptotalálkozókon, fórumokon, és nem rendelkezett jelentős szakmai múlttal a szektorban.",
			en: "Caduceus Zrt. was registered in the company registry. Prior to registration, the company was unknown in the crypto industry: it had no presence at local crypto meetups, forums, and no notable track record in the sector.",
		},
		sourceSlugs: new Set([
			"caduceus-cegkivonat",
			"caduceus-cegbetekintes",
			"caduceus-cegkozlony",
			"bitcoinbazis-caduceus",
		]),
		exchangeSlugs: new Set(),
	},
	"sztfh-elso-validator": {
		date: new Date("2025-12-19"),
		type: "primary",
		title: {
			hu: "Első kripto validátor engedélyezése",
			en: "First crypto validator licensed",
		},
		summary: {
			hu: "Az SZTFH engedélyezte és nyilvántartásba vette az első kripto validátort. <b>Egyetlen magáncég, a Caduceus lett felelős az összes magyarországi kriptoeszköz-átváltás validálásáért.</b> Az SZTFH iránymutatást is közzétett a rendelet alkalmazásáról. <b>A kripto validálás pontos tartalma továbbra sincs definiálva.</b>",
			en: "SZTFH licensed and registered the first crypto validator. <b>A single private company, Caduceus, became responsible for validating all crypto-asset exchanges in Hungary.</b> SZTFH also published guidance on the application of the regulation. <b>The exact content of crypto validation remains undefined.</b>",
		},
		sourceSlugs: new Set([
			"sztfh-kozlemeny-2025-12-19",
			"sztfh-validator-nyilvantartas",
			"sztfh-iranymutatas-2025-12-19",
			"bitcoinbazis-caduceus",
			"caduceus-cegkivonat",
		]),
		exchangeSlugs: new Set(),
	},
	"sztfh-rendelet-alkalmazas-kezdete": {
		date: new Date("2025-12-27"),
		type: "primary",
		title: {
			hu: "Kripto validálás kötelezővé válik",
			en: "Crypto validation becomes mandatory",
		},
		summary: {
			hu: "A 10/2025. (X. 27.) SZTFH rendelet alkalmazása megkezdődik – 60 nappal a kihirdetés után. <b>Ettől a naptól minden kriptoeszköz-átváltási szolgáltatónak SZTFH által nyilvántartott kripto validátort kell igénybe vennie.</b> A kripto validálás nélküli szolgáltatás nyújtása bűncselekménynek minősül. A gyakorlatban ez a szabályozatlan kriptokereskedelem végét jelenti Magyarországon.",
			en: "Application of SZTFH Regulation 10/2025 (X. 27.) begins – 60 days after publication. <b>From this date, all crypto-asset exchange service providers must use an SZTFH-registered crypto validator.</b> Providing services without crypto validation constitutes a criminal offense. In practice, this marks the end of unregulated crypto trading in Hungary.",
		},
		sourceSlugs: new Set([
			"sztfh-rendelet-10-2025",
			"sztfh-iranymutatas-2025-12-19",
			"telex-kripto-2025-12-25",
			"cryptofalka-szabalyozas-2026",
		]),
		exchangeSlugs: new Set(),
	},
	"caduceus-weboldal": {
		date: new Date("2025-12-19"),
		type: "tertiary",
		title: {
			hu: "Caduceus weboldal indítása",
			en: "Caduceus website launch",
		},
		summary: {
			hu: "Caduceus elindította weboldalát (caduceus.hu) – mindössze napokkal az új szabályok hatálybalépése előtt. A weboldal minimális információt tartalmazott: hiányoztak az EU-s előírásoknak megfelelő adatvédelmi és süti-szabályzatok, részletes szolgáltatásleírások. Csak bejelentkezési portál, ÁSZF és elérhetőség volt elérhető.",
			en: "Caduceus launched its website (caduceus.hu) – just days before the new rules took effect. The website was minimal, lacking EU-compliant privacy and cookie policies as well as detailed service descriptions. Only a login portal, terms of service, and contact information were available.",
		},
		sourceSlugs: new Set(["caduceus-weboldal", "bitcoinbazis-caduceus"]),
		exchangeSlugs: new Set(),
	},
	"revolut-bejelentes": {
		date: new Date("2025-12-08"),
		type: "tertiary",
		title: {
			hu: "Revolut bejelenti a teljes kivonulást",
			en: "Revolut announces complete withdrawal",
		},
		summary: {
			hu: "A Revolut bejelentette kriptovaluta-szolgáltatásainak teljes megszüntetését Magyarországon. Az ügyfeleknek december 18-ig kell rendelkezniük kriptoeszközeikről.",
			en: "Revolut announced the complete termination of cryptocurrency services in Hungary. Customers must manage their crypto assets by December 18.",
		},
		sourceSlugs: new Set([
			"revolut-telex-2025-12-08",
			"revolut-help-hu",
			"revolut-24hu-2025-12-08",
		]),
		exchangeSlugs: new Set(["revolut"]),
	},
	"revolut-kivonulas": {
		date: new Date("2025-12-18"),
		type: "secondary",
		title: {
			hu: "Revolut kriptovaluta-szolgáltatások megszűnése Magyarországon",
			en: "Revolut cryptocurrency services end in Hungary",
		},
		summary: {
			hu: "A Revolut kriptovaluta-szolgáltatásai megszűntek Magyarországon. A határidőig el nem adott kriptoeszközök automatikus értékesítésre kerültek.",
			en: "Revolut cryptocurrency services ended in Hungary. Crypto assets not sold by the deadline were automatically liquidated.",
		},
		sourceSlugs: new Set([
			"revolut-telex-2025-12-08",
			"revolut-help-hu",
			"revolut-24hu-2025-12-08",
		]),
		exchangeSlugs: new Set(["revolut"]),
	},
	"strike-bejelentes": {
		date: new Date("2026-01-07"),
		type: "tertiary",
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
	"strike-kivonulas": {
		date: new Date("2026-01-09"),
		type: "secondary",
		title: {
			hu: "Strike szolgáltatások korlátozása Magyarországon",
			en: "Strike services restricted in Hungary",
		},
		summary: {
			hu: "A Strike-nál megszűnt a vásárlás és eladás funkció Magyarországon. Csak EUR és BTC kivétel maradt elérhető.",
			en: "Strike discontinued buy and sell features in Hungary. Only EUR and BTC withdrawals remain available.",
		},
		sourceSlugs: new Set(),
		exchangeSlugs: new Set(["strike"]),
	},
	"etoro-bejelentes": {
		date: new Date("2025-12-18"),
		type: "tertiary",
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
		type: "secondary",
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
	"ahang-peticio": {
		date: new Date("2025-07-08"),
		type: "secondary",
		title: {
			hu: '"A Kriptovaluta nem bűntény!" petíció indítása',
			en: '"Cryptocurrency is Not a Crime!" petition launched',
		},
		summary: {
			hu: "Civil petíció indult az Országgyűléshez a kriptovaluta-szabályozás felülvizsgálatáért. A petíció szerint a törvény sérti a jogbiztonság és arányosság elvét, ellehetetleníti a magyar kriptoszektort, és az EU-s szabályozásnál szigorúbb, aránytalan szankciókat vezet be.",
			en: "A civil petition was launched to the Parliament requesting a review of cryptocurrency regulation. The petition argues the law violates principles of legal certainty and proportionality, makes the Hungarian crypto sector impossible, and introduces disproportionately strict sanctions exceeding EU standards.",
		},
		sourceSlugs: new Set(["ahang-peticio-2025-07-08"]),
		exchangeSlugs: new Set(),
	},
	"coincash-regisztracio-szunetel": {
		date: new Date("2025-07-08"),
		type: "tertiary",
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
	"coincash-bejelentes": {
		date: new Date("2025-12-17"),
		type: "tertiary",
		title: {
			hu: "CoinCash bejelenti szolgáltatásainak felfüggesztését",
			en: "CoinCash announces suspension of services",
		},
		summary: {
			hu: "A CoinCash bejelentette, hogy december 18-tól ideiglenesen felfüggeszti szolgáltatásait Magyarországon.",
			en: "CoinCash announced the temporary suspension of services in Hungary from December 18.",
		},
		sourceSlugs: new Set(["coincash-blog-2025-12-17"]),
		exchangeSlugs: new Set(["coincash"]),
	},
	"coincash-felfuggesztes": {
		date: new Date("2025-12-18"),
		type: "secondary",
		title: {
			hu: "CoinCash szolgáltatások ideiglenes felfüggesztése",
			en: "CoinCash services temporarily suspended",
		},
		summary: {
			hu: "A CoinCash ideiglenesen felfüggesztette szolgáltatásait Magyarországon. Új váltási megbízás nem adható le a felületeken.",
			en: "CoinCash temporarily suspended services in Hungary. New exchange orders cannot be placed on the platforms.",
		},
		sourceSlugs: new Set([
			"coincash-telex-2025-12-18",
			"coincash-portfolio-2025-12-18",
			"coincash-hvg-2025-12-18",
		]),
		exchangeSlugs: new Set(["coincash"]),
	},
	"bitstamp-kereskedes-felfuggesztve": {
		date: new Date("2025-07-09"),
		type: "secondary",
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
	// Date found via Wayback Machine: Hungary not on list on 2025-07-20, on list on 2025-08-26
	// with "Last updated 13 days ago" → ~2025-08-13
	"uphold-uj-fiokok-korlatozva": {
		date: new Date("2025-08-13"),
		type: "secondary",
		title: {
			hu: "Uphold nem fogad új magyar ügyfeleket",
			en: "Uphold stops accepting new Hungarian customers",
		},
		summary: {
			hu: "Az Uphold felvette Magyarországot azon országok listájára, ahol nem nyithatók új fiókok. A meglévő ügyfelek korlátozott hozzáféréssel továbbra is használhatják a szolgáltatást.",
			en: "Uphold added Hungary to its list of countries where new accounts cannot be opened. Existing customers may continue using the service with limited access.",
		},
		sourceSlugs: new Set(["uphold-non-supported-jurisdictions"]),
		exchangeSlugs: new Set(["uphold"]),
	},
	// Date found via Wayback Machine: Hungary on list on 2025-06-18, not on list on 2025-09-10
	// No intermediate snapshots available. Using 2025-09-10 as the earliest confirmed date.
	"swissborg-magyarorszag-eltavolitva": {
		date: new Date("2025-09-10"),
		type: "secondary",
		title: {
			hu: "SwissBorg már nem támogatja Magyarországot",
			en: "SwissBorg no longer supports Hungary",
		},
		summary: {
			hu: "A SwissBorg eltávolította Magyarországot a támogatott országok listájáról. A szolgáltatás új és meglévő magyar ügyfelek számára egyaránt megszűnt.",
			en: "SwissBorg removed Hungary from its list of supported countries. The service is no longer available for new or existing Hungarian customers.",
		},
		sourceSlugs: new Set(["swissborg-supported-countries"]),
		exchangeSlugs: new Set(["swissborg"]),
	},
	"kriptomat-bejelentes": {
		date: new Date("2025-12-22"),
		type: "tertiary",
		title: {
			hu: "Kriptomat bejelenti kereskedési szolgáltatásainak felfüggesztését",
			en: "Kriptomat announces suspension of trading services",
		},
		summary: {
			hu: "A Kriptomat bejelentette, hogy december 26-tól 23:00-tól ideiglenesen felfüggeszti kereskedési szolgáltatásait Magyarországon.",
			en: "Kriptomat announced the temporary suspension of trading services in Hungary from December 26 at 23:00 CET.",
		},
		sourceSlugs: new Set(["kriptomat-official-2025-12-22", "kriptomat-revb-2025-12-24"]),
		exchangeSlugs: new Set(["kriptomat"]),
	},
	"kriptomat-felfuggesztes": {
		date: new Date("2025-12-26"),
		type: "secondary",
		title: {
			hu: "Kriptomat kereskedési szolgáltatások felfüggesztése Magyarországon",
			en: "Kriptomat trading services suspended in Hungary",
		},
		summary: {
			hu: "A Kriptomat ideiglenesen felfüggesztette kereskedési szolgáltatásait Magyarországon. A vétel, eladás, váltás, KriptoEarn és Intelligent Portfolios szünetel, de a kifizetések elérhetők maradnak.",
			en: "Kriptomat temporarily suspended trading services in Hungary. Buy, sell, exchange, KriptoEarn, and Intelligent Portfolios paused, but withdrawals remain available.",
		},
		sourceSlugs: new Set(["kriptomat-index-2025-12-25", "kriptomat-privatbankar-2025-12-25"]),
		exchangeSlugs: new Set(["kriptomat"]),
	},
	"bitvavo-bejelentes": {
		date: new Date("2025-12-20"),
		type: "tertiary",
		title: {
			hu: "Bitvavo bejelenti szolgáltatásainak felfüggesztését Magyarországon",
			en: "Bitvavo announces suspension of services in Hungary",
		},
		summary: {
			hu: "A Bitvavo bejelentette, hogy december 26-tól (17:00 CET) felfüggeszti a kereskedést és befizetést magyar ügyfelek számára. A kereskedési célú (trade-only) eszközöket a határidőig el kell adni.",
			en: "Bitvavo announced the suspension of trading and deposits for Hungarian customers from December 26 (17:00 CET). Trade-only assets must be sold before the deadline.",
		},
		sourceSlugs: new Set(["bitvavo-support-2025-12"]),
		exchangeSlugs: new Set(["bitvavo"]),
	},
	"bitvavo-felfuggesztes": {
		date: new Date("2025-12-26"),
		type: "secondary",
		title: {
			hu: "Bitvavo kereskedés és befizetés felfüggesztése Magyarországon",
			en: "Bitvavo trading and deposits suspended in Hungary",
		},
		summary: {
			hu: "A Bitvavo felfüggesztette a kereskedést és befizetést magyar ügyfelek számára. Csak euró kifizetés és kriptoeszközök külső tárcába utalása lehetséges. A kereskedési célú eszközök eladhatatlanná váltak.",
			en: "Bitvavo suspended trading and deposits for Hungarian customers. Only euro withdrawals and crypto transfers to external wallets remain available. Trade-only assets became unsellable.",
		},
		sourceSlugs: new Set(["bitvavo-support-2025-12"]),
		exchangeSlugs: new Set(["bitvavo"]),
	},
	"moonpay-nem-tamogatott": {
		date: new Date("2026-01-02"),
		type: "secondary",
		title: {
			hu: "MoonPay nem támogatja Magyarországot",
			en: "MoonPay does not support Hungary",
		},
		summary: {
			hu: "A MoonPay hivatalos oldala szerint Magyarország a nem támogatott országok listáján szerepel. A szolgáltatás – beleértve a kriptovaluta vásárlást bankkártyával – nem elérhető magyar ügyfelek számára.",
			en: "According to MoonPay's official page, Hungary is listed as an unsupported country. The service – including cryptocurrency purchases via card – is not available to Hungarian customers.",
		},
		sourceSlugs: new Set(["moonpay-unsupported-countries"]),
		exchangeSlugs: new Set(["moonpay"]),
	},
	"vsbz-indulas": {
		date: new Date("2026-01-08"),
		type: "secondary",
		title: {
			hu: "Valid Since Block Zero (VSBZ) weboldal elindítása",
			en: "Valid Since Block Zero (VSBZ) website launch",
		},
		summary: {
			hu: "Elindult a VSBZ (vsbz.wikilegia.org), egy közösségi tudásbázis a kriptoeszköz-validálási kötelezettségről. A weboldal kérdéseket, e-mail sablonokat, anonimizált hatósági levelezéseket és piaci elemzéseket tartalmaz.",
			en: "VSBZ (vsbz.wikilegia.org) launched as a community knowledge base about crypto-asset validation requirements. The website contains questions, email templates, anonymized regulatory correspondence, and market analyses.",
		},
		sourceSlugs: new Set(["vsbz-wikilegia"]),
		exchangeSlugs: new Set(),
	},
	// Date based on page "Updated" timestamp: 07 Jan 2026
	// No Wayback Machine snapshots available with content to verify exact date
	"nebeus-magyarorszag-korlatozva": {
		date: new Date("2026-01-07"),
		type: "secondary",
		title: {
			hu: "Nebeus nem fogad új magyar ügyfeleket",
			en: "Nebeus stops accepting new Hungarian customers",
		},
		summary: {
			hu: "Magyarország felkerült a Nebeus korlátozott országainak listájára. Új fiók létrehozása nem engedélyezett magyar felhasználók számára.",
			en: "Nebeus added Hungary to its list of restricted countries. Hungarian users cannot create new accounts on the platform.",
		},
		sourceSlugs: new Set(["nebeus-restricted-countries"]),
		exchangeSlugs: new Set(["nebeus"]),
	},
	"k-13426-benyujtva": {
		date: new Date("2026-01-12T13:43:00"),
		type: "tertiary",
		title: {
			hu: "Írásbeli kérdés a miniszterelnökhöz a kriptoeszköz-szabályozásról (DK)",
			en: "Written question to the Prime Minister about crypto-asset regulation (DK)",
		},
		summary: {
			hu: "Varju László (DK) írásbeli kérdést nyújtott be Orbán Viktor miniszterelnökhöz. A kérdés 8 pontban vizsgálja a validáló szolgáltatói rendszer problémáit, beleértve a végrehajtási moratórium lehetőségét, a versenyjogi aggályokat, és a nemzetbiztonsági kockázatokat.",
			en: "László Varju (DK) submitted a written question to Prime Minister Viktor Orbán. The question examines in 8 points the problems of the validation service provider system, including the possibility of an implementation moratorium, competition law concerns, and national security risks.",
		},
		sourceSlugs: new Set(["parlament-k-13426", "parlament-k-13426-oldal"]),
		exchangeSlugs: new Set(),
	},
	"k-13436-benyujtva": {
		date: new Date("2026-01-13"),
		type: "tertiary",
		title: {
			hu: "Írásbeli kérdés a miniszterelnökhöz a kriptoeszköz-szabályozásról (Mi Hazánk)",
			en: "Written question to the Prime Minister about crypto-asset regulation (Mi Hazánk)",
		},
		summary: {
			hu: "Szabadi István (Mi Hazánk) írásbeli kérdést nyújtott be Orbán Viktor miniszterelnökhöz. A kérdés 5 pontban firtatja a kriptoeszköz-szabályozás következményeit, beleértve a végrehajtási moratórium lehetőségét, a validátor hiányából eredő jogbizonytalanságot, és a MiCA-engedéllyel rendelkező szolgáltatók kizárását.",
			en: "István Szabadi (Our Homeland Movement) submitted a written question to Prime Minister Viktor Orbán. The question addresses 5 points about the consequences of crypto-asset regulation, including the possibility of an implementation moratorium, legal uncertainty from validator shortage, and exclusion of MiCA-licensed providers.",
		},
		sourceSlugs: new Set(["parlament-k-13436", "parlament-k-13436-oldal"]),
		exchangeSlugs: new Set(),
	},
	"k-13444-benyujtva": {
		date: new Date("2026-01-15T14:58:00"),
		type: "tertiary",
		title: {
			hu: "Írásbeli kérdés a miniszterelnökhöz a kriptoeszköz-szabályozásról (Momentum)",
			en: "Written question to the Prime Minister about crypto-asset regulation (Momentum)",
		},
		summary: {
			hu: "Gelencsér Ferenc (Momentum) írásbeli kérdést nyújtott be Orbán Viktor miniszterelnökhöz. A kérdés a végrehajtási moratórium bevezetésének lehetőségét firtatja, amíg több validáló szolgáltató nem áll rendelkezésre és az SZTFH nem tesz közzé gyakorlati útmutatót.",
			en: "Ferenc Gelencsér (Momentum) submitted a written question to Prime Minister Viktor Orbán. The question asks about introducing an implementation moratorium until more validation service providers become available and SZTFH publishes practical guidance.",
		},
		sourceSlugs: new Set(["parlament-k-13444", "parlament-k-13444-oldal"]),
		exchangeSlugs: new Set(),
	},
	"frissites-2026-01-14": {
		date: new Date("2026-01-14"),
		type: "telegram",
		title: {
			hu: "Frissítés: Újabb tőzsdék korlátozásai",
			en: "Update: More exchange restrictions",
		},
		summary: {
			hu: "Frissítettük az oldalt az Uphold, SwissBorg és Nebeus magyarországi korlátozásaival.",
			en: "We updated the site with Uphold, SwissBorg and Nebeus restrictions in Hungary.",
		},
		sourceSlugs: new Set(),
		exchangeSlugs: new Set(["uphold", "swissborg", "nebeus"]),
	},
	"k-13448-benyujtva": {
		date: new Date("2026-01-16T12:53:00"),
		type: "tertiary",
		title: {
			hu: "Írásbeli kérdés a nemzetgazdasági miniszterhez a kriptoeszköz-validálásról (Párbeszéd)",
			en: "Written question to the Minister of National Economy about crypto-asset validation (Dialogue)",
		},
		summary: {
			hu: "Tordai Bence (Párbeszéd) írásbeli kérdést nyújtott be Nagy Márton István nemzetgazdasági miniszterhez. A kérdés a végrehajtási moratórium bevezetésének lehetőségét firtatja, valamint rákérdez, miért szükséges a magyar validátor, ha a MiCA-reguláció már kötelezi a centralizált tőzsdéket hasonló ellenőrzésekre.",
			en: "Bence Tordai (Dialogue) submitted a written question to Minister of National Economy Márton István Nagy. The question asks about introducing an implementation moratorium, and questions why Hungarian validators are necessary when MiCA regulation already requires centralized exchanges to perform similar checks.",
		},
		sourceSlugs: new Set(["parlament-k-13448", "parlament-k-13448-oldal"]),
		exchangeSlugs: new Set(),
	},
	"eu-kotelezettszeges-eljaras": {
		date: new Date("2026-01-30"),
		type: "secondary",
		title: {
			hu: "Európai Bizottság kötelezettségszegési eljárást indít Magyarország ellen",
			en: "European Commission opens infringement procedure against Hungary",
		},
		summary: {
			hu: 'Az Európai Bizottság kötelezettségszegési eljárást indított Magyarország ellen (INFR(2025)2174), mert a 2025. évi LXVII. törvény nem teljesíti maradéktalanul a MiCA-rendeletet. <b>A Bizottság szerint az új „kriptoeszköz-átváltást validáló szolgáltatásokra" vonatkozó engedélyezési rendszer büntetőjogi felelősséggel nem összeegyeztethető a MiCA-val.</b> A Bizottság megjegyezte, hogy a szabályozás miatt kriptoeszköz-szolgáltatók felfüggesztették szolgáltatásaikat, ami károsította az ügyfeleket és jogbizonytalanságot teremtett. Magyarországnak két hónapja van válaszolni.',
			en: "The European Commission has opened an infringement procedure against Hungary (INFR(2025)2174), as Act LXVII of 2025 fails to fully comply with MiCA regulation. <b>According to the Commission, the new authorisation regime for 'exchange validation services' with criminal liability is incompatible with MiCA.</b> The Commission noted that the regulation has led crypto-asset service providers to suspend services, prejudicing clients and creating legal uncertainty. Hungary has two months to respond.",
		},
		sourceSlugs: new Set(["ec-inf-26-115", "telex-eu-kotelezettszeges-eljaras-2026-01-30"]),
		exchangeSlugs: new Set(),
	},
};
