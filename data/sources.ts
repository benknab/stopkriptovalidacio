import type { TextI18n } from "./types.ts";

export type Source = {
	title: TextI18n;
	originalUrl: string;
	archivedUrl?: string;
	summary?: TextI18n;
	text?: TextI18n;
};

export const sources = {
	"parlament-11922": {
		title: { hu: "T/11922 Törvényjavaslat (PDF)", en: "T/11922 Bill (PDF)" },
		originalUrl: "https://www.parlament.hu/irom42/11922/11922.pdf",
		summary: {
			hu: "Magyarország versenyképességének javítása érdekében egyes törvények módosításáról szóló törvényjavaslat. Benyújtó: Dr. Semjén Zsolt, miniszterelnök-helyettes. Előadó: Tuzson Bence, igazságügyi miniszter.",
			en: "Bill on the amendment of certain laws to improve Hungary's competitiveness. Submitted by: Dr. Zsolt Semjén, Deputy Prime Minister. Presenter: Bence Tuzson, Minister of Justice.",
		},
		text: {
			hu: `66. A kriptoeszközök piacáról szóló 2024. évi VII. törvény módosítása

180. §
A kriptoeszközök piacáról szóló 2024. évi VII. törvény 10. § (2) bekezdésében „és az ügyfél" szövegrész helyébe „valamint az ügyfél" szöveg lép.

[Indokolás]
180. §
A kriptoeszközök piacáról szóló 2024. évi VII. törvény módosítását jogtechnikai pontosítás indokolja.`,
			en: `66. Amendment of Act VII of 2024 on the Market in Crypto-assets

Section 180
In Section 10(2) of Act VII of 2024 on the Market in Crypto-assets, the text "and the customer" shall be replaced by "as well as the customer".

[Reasoning]
Section 180
The amendment to Act VII of 2024 on the Market in Crypto-assets is justified by legal-technical clarification.`,
		},
	},
	"parlament-11922-oldal": {
		title: {
			hu: "T/11922 Iromány adatai (Parlament.hu)",
			en: "T/11922 Document Details (Parlament.hu)",
		},
		originalUrl:
			"https://www.parlament.hu/web/guest/szavazasok-adott-idoszakban?p_p_id=hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_auth=yn2Czm3g&_hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8_pairAction=%2Finternet%2Fcplsql%2Fogy_irom.irom_adat%3Fp_ckl%3D42%26p_izon%3D11922",
		summary: {
			hu: "Az iromány teljes története: benyújtástól a kihirdetésig. Állapot: kihirdetve. Kihirdetés: 2025. évi LXVII. törvény, Magyar Közlöny 2025/75. szám, 2025.06.23.",
			en: "Full document history: from submission to promulgation. Status: promulgated. Promulgation: Act LXVII of 2025, Magyar Közlöny issue 2025/75, 2025.06.23.",
		},
	},
	"parlament-11922-13": {
		title: { hu: "T/11922/13 Egységes javaslat (PDF)", en: "T/11922/13 Unified Proposal (PDF)" },
		originalUrl: "https://www.parlament.hu/irom42/11922/11922-0013.pdf",
		summary: {
			hu: "Túlterjeszkedő módosító javaslatot tartalmazó egységes javaslat. Benyújtó: Törvényalkotási Bizottság. A kriptoeszköz-átváltást validáló szolgáltatásra és a kriptoeszközzel visszaélés bűncselekményére vonatkozó rendelkezéseket tartalmazza.",
			en: "Unified proposal containing overreaching amendments. Submitted by: Legislation Committee. Contains provisions on crypto-asset exchange validation services and the criminal offense of crypto-asset abuse.",
		},
	},
	"parlament-11922-ind03": {
		title: {
			hu: "T/11922 Egységes javaslat indokolása (PDF)",
			en: "T/11922 Unified Proposal Explanatory Memorandum (PDF)",
		},
		originalUrl: "https://www.parlament.hu/irom42/11922/11922ind03.pdf",
		summary: {
			hu: "Az egységes javaslattervezethez készített előterjesztői indokolás (2025.06.10.). Részletes indokolás a kriptoeszközzel visszaélés bűncselekményi tényállásáról és a validálási kötelezettségről.",
			en: "Explanatory memorandum for the unified proposal (2025.06.10.). Detailed reasoning on the criminal offense of crypto-asset abuse and validation requirements.",
		},
		text: {
			hu: `101. §
A kriptoeszközzel visszaélésre külön bűncselekményi tényállást állapít meg a javaslat.

A kriptoeszközzel visszaélés bűncselekményének tényállása szerint a jogosulatlan kriptoeszköz-átváltási szolgáltatás igénybe vevője bűncselekményt követ el. Az igénybe vevő lehet jogi személy vagy magánszemély, amely, illetve aki jogosulatlan szolgáltatótól vesz át nem validált kriptoeszköz átváltásából származó pénzegyenértéket.

A bűncselekmény elkövetési magatartása az ágazati szabályok szándékos kijátszásával végrehajtott, nem validált kriptoeszköz váltás. A tényállás jogosulatlan kriptoeszköz-átváltási szolgáltatás igénybevétele fogalmat használja, amely a törvénnyel bevezetett 408/A. § szerinti új bűncselekmény elkövetési magatartására, tehát az ott meghatározott módon nyújtott tiltott kriptoeszköz váltó szolgáltatás igénybevételét jelenti.

A több részletben, rövid időn belül, egységes akaratelhatározással végrehajtott átváltás, illetve átváltások bűncselekményegység keretében nyerhetnek értékelést, ideértve különösen azt az esetet, amikor az átváltások összegszerűségének meghatározása a tényállásban szereplő értékhatár kijátszását célozná.

A bűncselekmény szubszidiárius bűncselekmény, így amennyiben a nem validált kriptoeszköz váltás más, súlyosabb bűncselekményt valósít meg (így különösen vagyon elleni bűncselekményt, pénzmosást), úgy a súlyosabb bűncselekmény megállapításának van helye.

102. §
A javaslat szerint a jogosulatlan kriptoeszköz-átváltási szolgáltatás nyújtása során mindazok a kriptoeszköz-átváltási szolgáltatást végzők, akik ügyfél-, és ügylet-validálás nélkül kriptoeszköz-átváltási szolgáltatást nyújtanak, bűncselekményt követnek el.

A bűncselekmény elkövetési magatartása a validálási szabályok megsértésével folytatott átváltási tevékenység folytatása. Az elkövetés két formában valósulhat meg: egyrészt az eleve engedély nélkül történő pénzügyi szolgáltatási tevékenység keretei között folytatott átváltási tevékenységgel, másrészt az engedéllyel rendelkező pénzügyi szolgáltató által végzett - ágazati szabályt sértő - nem validált tevékenységgel.

198-201. §
A módosítás a kriptoeszköz-átváltást validáló szolgáltatók felügyeletével kapcsolatos feladatokat - a kriptoeszközök piacáról szóló 2024. évi VII. törvény módosítására vonatkozó javaslatokkal összhangban - a Szabályozott Tevékenységek Felügyeleti Hatóságához telepíti.

253-256. §
A módosítás célja biztosítani a kriptoeszközök transzparens és biztonságos átváltó szolgáltatását. A kriptoeszközök technikai jellemzőik miatt gyakran kerülnek felhasználásra jogellenes tevékenységek során, valamint gyakran jogellenesen szerzik meg azokat. Az ily módon megszerzett vagy felhasználni kívánt kriptoeszközök jelentős károkat okoznak mind a gazdaságnak mind pedig az állampolgároknak, ezért szükséges egy olyan rendszer bevezetése, amely ezen eszközök pénzre vagy más kriptoeszközre váltását kontroll alá helyezi.

Az új szabályozási keret ösztönzi a jogkövető piaci szereplőket, miközben visszaszorítja azokat a szolgáltatókat, amelyek nem felelnek meg a minimális biztonsági és átláthatósági normáknak. Ez nemcsak a fogyasztók védelmét szolgálja, hanem hozzájárul a pénzügyi rendszer integritásának megőrzéséhez.

A javaslat:
- kiegészíti a törvény fogalmi készletét,
- meghatározza a kriptoeszköz-átváltást validáló szolgáltató igénybevételére vonatkozó követelményt,
- rögzíti a kriptoeszköz-átváltási szolgáltatást végző kriptoeszköz szolgáltatókra vonatkozó követelményeket,
- megállapítja a kriptoeszköz-átváltást validáló szolgáltatás minimum követelményeit (ügyfél- és ügylet azonosítás),
- meghatározza a kriptoeszköz átváltást validáló szolgáltató szervezetére vonatkozó követelményeket.

257. §
A javaslat a Szabályozott Tevékenységek Felügyeleti Hatóságát jelöli ki a kriptoeszköz-átváltást validáló szolgáltatók felügyeletére, valamint biztosítja a felügyeleti hatásköröket részére.

258. §
A Kormány, valamint a Szabályozott Tevékenységek Felügyeleti Hatósága elnöke részére felhatalmazó rendelkezést állapít meg a kriptoeszköz-átváltást validáló szolgáltatás felügyeletével kapcsolatos részletes szabályokra.

259. §
Átmeneti rendelkezés: a kriptoeszköz-átváltási szolgáltatást végző kriptoeszköz szolgáltatóknak a kriptoeszköz-átváltást validáló szolgáltató igénybevételére vonatkozó rendelkezéseket a Szabályozott Tevékenységek Felügyeleti Hatósága elnökének a kriptoeszköz-átváltást validáló szolgáltató tevékenységek engedélyezésére vonatkozó rendeletének hatálybalépését követő 60. naptól kell alkalmazni.`,
			en: `Section 101
The proposal establishes a separate criminal offense for crypto-asset abuse.

According to the criminal offense of crypto-asset abuse, a user of unauthorized crypto-asset exchange services commits a crime. The user may be a legal entity or natural person who receives monetary equivalent from non-validated crypto-asset exchange from an unauthorized provider.

The criminal conduct is the execution of non-validated crypto-asset exchange through deliberate circumvention of sectoral rules. The offense uses the concept of "using unauthorized crypto-asset exchange service," which refers to the use of prohibited crypto exchange services provided in the manner specified in the new Section 408/A introduced by the law.

Multiple exchanges executed in installments within a short period under unified intent may be assessed as a single criminal unit, including cases where the amounts were structured to circumvent the value threshold in the offense.

The offense is subsidiary; if the non-validated crypto exchange constitutes another, more serious crime (particularly property crimes or money laundering), the more serious crime shall be established.

Section 102
According to the proposal, all crypto-asset exchange service providers who provide crypto-asset exchange services without customer and transaction validation commit a crime.

The criminal conduct is conducting exchange activities in violation of validation rules. Commission may occur in two forms: through exchange activities conducted without authorization for financial services, or through non-validated activities by licensed financial service providers in violation of sectoral rules.

Sections 198-201
The amendment assigns tasks related to the supervision of crypto-asset exchange validation service providers to the Regulated Activities Supervisory Authority, in line with the proposed amendments to Act VII of 2024 on the Market in Crypto-assets.

Sections 253-256
The purpose of the amendment is to ensure transparent and secure crypto-asset exchange services. Due to their technical characteristics, crypto-assets are frequently used in illegal activities and are often acquired illegally. Such acquired or intended crypto-assets cause significant damage to both the economy and citizens, therefore it is necessary to introduce a system that controls the exchange of these assets for money or other crypto-assets.

The new regulatory framework encourages compliant market participants while suppressing providers that do not meet minimum security and transparency standards. This serves not only consumer protection but also contributes to maintaining the integrity of the financial system.

The proposal:
- supplements the law's conceptual framework,
- defines requirements for using crypto-asset exchange validation service providers,
- establishes requirements for crypto service providers conducting crypto-asset exchange services,
- sets minimum requirements for crypto-asset exchange validation services (customer and transaction identification),
- defines organizational requirements for crypto-asset exchange validation service providers.

Section 257
The proposal designates the Regulated Activities Supervisory Authority for the supervision of crypto-asset exchange validation service providers and grants supervisory powers.

Section 258
The proposal establishes authorizing provisions for the Government and the President of the Regulated Activities Supervisory Authority regarding detailed rules on the supervision of crypto-asset exchange validation services.

Section 259
Transitional provision: crypto service providers conducting crypto-asset exchange services must apply the provisions on using crypto-asset exchange validation service providers from the 60th day after the entry into force of the decree of the President of the Regulated Activities Supervisory Authority on licensing crypto-asset exchange validation service provider activities.`,
		},
	},
	"parlament-11922-ind05": {
		title: {
			hu: "T/11922 Elfogadott törvény indokolása (PDF)",
			en: "T/11922 Adopted Law Explanatory Memorandum (PDF)",
		},
		originalUrl: "https://www.parlament.hu/irom42/11922/11922ind05.pdf",
		summary: {
			hu: "Az elfogadott törvényhez készített előterjesztői indokolás. Közzététel: Indokolások Tára, 2025. évi 56. szám. A kriptoeszközökre vonatkozó rendelkezések változatlanok maradtak az egységes javaslathoz képest.",
			en: "Explanatory memorandum for the adopted law. Published in: Indokolások Tára, 2025 issue 56. Provisions on crypto-assets remained unchanged compared to the unified proposal.",
		},
	},
	"sztfh-rendelet-10-2025": {
		title: {
			hu: "10/2025. (X. 27.) SZTFH rendelet (Jogtar)",
			en: "SZTFH Regulation 10/2025 (X. 27.) (Jogtar)",
		},
		originalUrl: "https://net.jogtar.hu/jogszabaly?docid=a2500010.stf",
		summary: {
			hu: "A kriptoeszköz-átváltást validáló szolgáltató engedélyezésének és nyilvántartásának részletes szabályairól szóló rendelet. Hatályba lép a kihirdetést követő 3. napon, alkalmazni a kihirdetést követő 60. naptól kell.",
			en: "Regulation on the detailed rules for licensing and registration of crypto-asset exchange validation service providers. Enters into force on the 3rd day after publication, applicable from the 60th day after publication.",
		},
	},
	"sztfh-kozlemeny-2025-10-27": {
		title: { hu: "SZTFH közlemény (2025.10.27.)", en: "SZTFH Announcement (2025.10.27.)" },
		originalUrl: "https://sztfh.hu/megjelentek-a-kripto-tv-hez-kapcsolodo-reszletszabalyok/",
		summary: {
			hu: "Az SZTFH hivatalos közleménye a 10/2025. (X. 27.) SZTFH rendelet megjelenéséről. A végrehajtási rendeletet a kihirdetését követő 60. naptól kell alkalmazni.",
			en: "Official SZTFH announcement on the publication of SZTFH Regulation 10/2025 (X. 27.). The implementing regulation must be applied from the 60th day after its publication.",
		},
	},
	"sztfh-kozlemeny-2025-12-19": {
		title: { hu: "SZTFH közlemény (2025.12.19.)", en: "SZTFH Announcement (2025.12.19.)" },
		originalUrl: "https://sztfh.hu/megtortent-az-elso-kriptoeszkoz-atvaltast-validalo-szolgaltato-engedelyezese/",
		summary: {
			hu: "Az SZTFH közleménye az első kriptoeszköz-átváltást validáló szolgáltató engedélyezéséről. Caduceus lett az első és egyetlen engedélyezett validátor.",
			en: "SZTFH announcement on the licensing of the first crypto-asset exchange validation service provider. Caduceus became the first and only licensed validator.",
		},
	},
	"sztfh-validator-nyilvantartas": {
		title: { hu: "SZTFH validátor nyilvántartás", en: "SZTFH Validator Registry" },
		originalUrl: "https://sztfh.hu/nyilvantartasok/kriptoeszkoz-atvaltast-validalo-szolgaltatok/",
		summary: {
			hu: "Az SZTFH által vezetett kriptoeszköz-átváltást validáló szolgáltatók nyilvántartása.",
			en: "Registry of crypto-asset exchange validation service providers maintained by SZTFH.",
		},
	},
	"sztfh-rendelet-12-2025": {
		title: {
			hu: "12/2025. (XI. 28.) SZTFH rendelet (NJT)",
			en: "SZTFH Regulation 12/2025 (XI. 28.) (NJT)",
		},
		originalUrl: "https://njt.hu/jogszabaly/2025-12-20-8K",
		summary: {
			hu: "A kriptoeszköz-átváltást validáló szolgáltató engedélyezésével összefüggő eljárások igazgatási szolgáltatási díjairól szóló rendelet. Az engedélyezési eljárás díja: 620 000 Ft.",
			en: "Regulation on administrative service fees for procedures related to licensing of crypto-asset exchange validation service providers. Licensing fee: 620,000 HUF.",
		},
	},
	"sztfh-iranymutatas-2025-12-19": {
		title: { hu: "SZTFH iránymutatás (PDF)", en: "SZTFH Guidance (PDF)" },
		originalUrl: "https://sztfh.hu/downloads/kiberbiztonsag/kripto/sztfh_rendelet_hatalya_hun.pdf",
		summary: {
			hu: "Iránymutatás a 10/2025. (X. 27.) SZTFH rendelet alkalmazására vonatkozóan. A rendelet hatályának értelmezése.",
			en: "Guidance on the application of SZTFH Regulation 10/2025 (X. 27.). Interpretation of the scope of the regulation.",
		},
		text: {
			hu: `IRÁNYMUTATÁS
A kriptoeszköz-átváltást validáló szolgáltató engedélyezésének és nyilvántartásának részletes szabályairól szóló 10/2025 (X.27.) SZTFH rendelet alkalmazására vonatkozóan.

A rendelet hatálya:
- Kiterjed az MNB által nyilvántartásba vett kriptoeszköz váltási tevékenység végzésére jogosult szervezetekre
- Kiterjed a határon átnyúló váltási tevékenység végzésére jogosult MiCA engedéllyel rendelkező szervezetekre
- Területi hatály: minden olyan váltási tevékenység, mely Magyarország területén lévő igénybe vevők felé irányul

Az SZTFH rendelet 2025. december 27-től alkalmazandó.

Az SZTFH által nyilvántartásba vett validáló szolgáltató a validálás eredményéről megfelelőségi nyilatkozatot állít ki.

Rendeletben meghatározott kivételek (nem szükséges validálni):
a) nem ellenérték fejében nyújtott szolgáltatás
b) nem rendszeres jelleggel nyújtott szolgáltatás
c) titkos információgyűjtésre feljogosított szerv tagja kezdeményezi
d) természetes személy kizárólag saját célra, saját kriptoeszközök más kriptoeszközre váltása
e) decentralizált szolgáltatás (DeFi, bridging, liquidity pooling)

Validálási kötelezettséget kiváltó tevékenységek:
1. Magyarországon bejegyzett MiCA engedélyes váltás
2. Határon átnyúló MiCA engedélyes váltás
3. Magyarországi pénzügyi szolgáltató részvétele
4. Magyar pénzügyi rendszerben adat keletkezik
5. Magyarországi informatikai rendszer igénybevétele
6. Magyarországi igénybe vevők felé irányuló szolgáltatás`,
			en: `GUIDANCE
On the application of SZTFH Regulation 10/2025 (X.27.) on detailed rules for licensing and registration of crypto-asset exchange validation service providers.

Scope of the regulation:
- Extends to organizations registered by MNB for crypto-asset exchange activities
- Extends to organizations with MiCA license for cross-border exchange activities
- Territorial scope: all exchange activities directed at users in Hungary

The SZTFH regulation is applicable from December 27, 2025.

The validation service provider registered by SZTFH issues a compliance statement on the result of validation.

Exceptions defined in the regulation (validation not required):
a) services not provided for consideration
b) services not provided on a regular basis
c) initiated by authorized covert intelligence personnel
d) natural person exclusively for own use, exchanging own crypto-assets
e) decentralized services (DeFi, bridging, liquidity pooling)

Activities triggering validation requirement:
1. Exchange by Hungary-registered MiCA licensee
2. Cross-border exchange by MiCA licensee
3. Participation of Hungarian financial service provider
4. Data generated in Hungarian financial system
5. Use of IT systems operated in Hungary
6. Services directed at users in Hungary`,
		},
	},
	"telex-kripto-btk": {
		title: { hu: "Telex", en: "Telex" },
		originalUrl: "https://telex.hu/gazdasag/2025/07/01/kripto-kriptodeviza-bitcoin-revolut-btk",
	},
	"telex-revolut-mica": {
		title: { hu: "Telex", en: "Telex" },
		originalUrl: "https://telex.hu/gazdasag/2025/10/23/revolut-mica-engedely-kriptovaluta",
	},
	"revolut-24hu-2025-07-04": {
		title: { hu: "24.hu", en: "24.hu" },
		originalUrl: "https://24.hu/fn/gazdasag/2025/07/04/revolut-kriptovaluta-szolgaltatas-szunetel-magyarorszagon/",
		summary: {
			hu: "A Revolut azonnali hatállyal szüneteltette kriptovaluta-szolgáltatásait Magyarországon. A közelmúltbeli jogszabályváltozások miatt vételi megbízások, staking és befizetések nem lehetségesek, de az eladás és külső pénztárcába utalás továbbra is elérhető.",
			en: "Revolut suspended cryptocurrency services in Hungary with immediate effect. Due to recent legislative changes, buy orders, staking, and deposits are unavailable, but selling and transfers to external wallets remain possible.",
		},
	},
	"revolut-telex-2025-07-09": {
		title: { hu: "Telex", en: "Telex" },
		originalUrl: "https://telex.hu/gazdasag/2025/07/09/kriptopiac-revolut-bitcoin-befektetes-megtakaritas",
		summary: {
			hu: "2025. július 2-án hatályba lépett szabályozás értelmében a kriptovaluta-kereskedelem engedélykötelessé vált Magyarországon. A Revolut ezt követően felfüggesztette szolgáltatásait, több százezer magyar ügyfél nem férhetett hozzá kriptoeszközeihez.",
			en: "Following regulations effective July 2, 2025, cryptocurrency trading became subject to licensing in Hungary. Revolut subsequently suspended its services, leaving hundreds of thousands of Hungarian customers without access to their crypto assets.",
		},
	},
	"revolut-telex-2025-12-08": {
		title: { hu: "Telex", en: "Telex" },
		originalUrl: "https://telex.hu/gazdasag/2025/12/08/revolut-kripto-szolgaltatas-magyarorszag-kivonul",
		summary: {
			hu: "A Revolut 2025. december 8-án bejelentette kriptovaluta-szolgáltatásainak teljes megszüntetését Magyarországon. Az ügyfeleknek december 18-ig kellett rendelkezniük kriptoeszközeikről, ezt követően automatikus értékesítés és számla lezárás következett.",
			en: "Revolut announced the complete termination of cryptocurrency services in Hungary on December 8, 2025. Customers had until December 18 to manage their crypto assets, after which automatic liquidation and account closure followed.",
		},
	},
	"revolut-help-hu": {
		title: { hu: "Revolut Súgó", en: "Revolut Help Center" },
		originalUrl: "https://help.revolut.com/hu-HU/help/crypto/question-crypto-hungary-pausing-services-retail/",
		summary: {
			hu: "A Revolut hivatalos tájékoztatója a kriptovaluta-szolgáltatások leállításáról a magyar jogszabályi változások miatt. Határidők: staking megszüntetése december 10., kriptó eladása december 18., átváltás befejezése december 25.",
			en: "Official Revolut announcement about termination of crypto services due to Hungarian legislative changes. Deadlines: unstaking December 10, crypto sales December 18, conversion complete December 25.",
		},
	},
	"revolut-24hu-2025-12-08": {
		title: { hu: "24.hu", en: "24.hu" },
		originalUrl: "https://24.hu/tech/2025/12/08/kripto-megszunes-revolut-magyarorszag/",
		summary: {
			hu: "A Revolut teljesen beszünteti kriptovaluta-szolgáltatásait Magyarországon. Az ügyfelek december 18-ig eladhatják vagy külső pénztárcába utalhatják kriptoeszközeiket, a staking december 10-én automatikusan megszűnik.",
			en: "Revolut completely terminates cryptocurrency services in Hungary. Customers can sell or transfer crypto to external wallets until December 18; staking ends automatically on December 10.",
		},
	},
	"etoro-portfolio-2025-12-19": {
		title: { hu: "Portfolio.hu", en: "Portfolio.hu" },
		originalUrl:
			"https://www.portfolio.hu/uzlet/20251219/felfuggeszti-kriptoszolgaltatasait-magyarorszagon-az-etoro-mutatjuk-meddig-tudsz-meg-adni-es-venni-807122",
		summary: {
			hu: "Az eToro bejelentette, hogy 2025. december 26-tól felfüggeszti a hagyományos kriptovaluta-kereskedést Magyarországon. A kripto CFD-k továbbra is elérhetők maradnak.",
			en: "eToro announced that it will suspend traditional cryptocurrency trading in Hungary from December 26, 2025. Crypto CFDs will remain available.",
		},
	},
	"etoro-vg-2025-12-18": {
		title: { hu: "VG", en: "VG" },
		originalUrl:
			"https://www.vg.hu/penz-es-tokepiac/2025/12/etoro-kriptokereskedelem-kivonulas-magyarorszag-revolut",
		summary: {
			hu: "A VG beszámolója az eToro magyarországi kriptokereskedelem megszüntetéséről a szigorodó hazai szabályozás miatt.",
			en: "VG report on eToro's termination of cryptocurrency trading in Hungary due to stricter domestic regulations.",
		},
	},
	"coincash-blog-2025-07-08": {
		title: { hu: "CoinCash Blog", en: "CoinCash Blog" },
		originalUrl: "https://coincash.eu/hu/blog/tovabbra-is-zavartalanul-mukodunk",
		summary: {
			hu: "A CoinCash közleménye szerint a regisztráció szünetel, de a meglévő ügyfelek továbbra is használhatják a webes váltási szolgáltatást.",
			en: "According to CoinCash's announcement, registration is suspended, but existing customers can continue to use the web exchange service.",
		},
	},
	"coincash-telex-2025-07-08": {
		title: { hu: "Telex", en: "Telex" },
		originalUrl: "https://telex.hu/gazdasag/2025/07/08/kriptopiac-revolut-bitcoin-befektetes-megtakaritas",
		summary: {
			hu: "A Telex beszámolója a CoinCash közleményéről: a webes váltás elérhető maradt, miközben a regisztráció szünetelt.",
			en: "Telex report on CoinCash's announcement: web exchange remained available while registration was suspended.",
		},
	},
	"coincash-blog-2025-12-17": {
		title: { hu: "CoinCash Blog", en: "CoinCash Blog" },
		originalUrl: "https://coincash.eu/hu/blog/ideiglenesen-felfuggeszti-a-szolgaltatasait-a-coincash",
		summary: {
			hu: "A CoinCash bejelentette, hogy 2025. december 18-tól ideiglenesen felfüggeszti szolgáltatásait. Új váltási megbízás nem adható le.",
			en: "CoinCash announced temporary suspension of services from December 18, 2025. New exchange orders cannot be placed.",
		},
	},
	"coincash-telex-2025-12-18": {
		title: { hu: "Telex", en: "Telex" },
		originalUrl:
			"https://telex.hu/gazdasag/2025/12/18/coincash-kivonul-magyarorszagrol-kriptovaluta-kozvetito-revolut-szabalyozas",
		summary: {
			hu: "A Telex összefoglalója: a Revolut után a CoinCash is leállítja kriptós szolgáltatásait Magyarországon.",
			en: "Telex summary: after Revolut, CoinCash also suspends crypto services in Hungary.",
		},
	},
	"coincash-portfolio-2025-12-18": {
		title: { hu: "Portfolio.hu", en: "Portfolio.hu" },
		originalUrl:
			"https://www.portfolio.hu/befektetes/20251218/breking-ma-nemcsak-a-revolut-de-a-coincash-is-felfuggeszti-kriptoszolgaltatasait-magyarorszagon-806822",
		summary: {
			hu: "A Portfolio beszámolója a CoinCash magyarországi kriptoszolgáltatásainak felfüggesztéséről.",
			en: "Portfolio report on CoinCash's suspension of cryptocurrency services in Hungary.",
		},
	},
	"coincash-hvg-2025-12-18": {
		title: { hu: "HVG", en: "HVG" },
		originalUrl: "https://hvg.hu/kkv/20251218_Felfuggesztes-magyar-kripto-CoinCash",
		summary: {
			hu: "A HVG összefoglalója a CoinCash szolgáltatásainak felfüggesztéséről.",
			en: "HVG summary on the suspension of CoinCash services.",
		},
	},
	"bitstamp-kriptoakademia-2025-07-09": {
		title: { hu: "KriptoAkadémia", en: "KriptoAkadémia" },
		originalUrl:
			"https://kriptoakademia.com/2025/07/09/a-revolut-utan-a-bitstamp-is-felfuggesztette-a-kriptokereskedest-magyarorszagon",
		summary: {
			hu: "A Revolut után a Bitstamp is felfüggesztette a kriptokereskedést Magyarországon a szabályozási változások miatt.",
			en: "After Revolut, Bitstamp also suspended cryptocurrency trading in Hungary due to regulatory changes.",
		},
	},
	"bitstamp-cryptofalka-2025-07-09": {
		title: { hu: "CryptoFalka", en: "CryptoFalka" },
		originalUrl: "https://cryptofalka.hu/tozsde/revolut-utan-bitstamp-szunetelteti-szolgaltatasat-magyarorszagon",
		summary: {
			hu: "A CryptoFalka beszámolója a Bitstamp magyarországi szolgáltatáskorlátozásáról a jogszabályváltozás miatt.",
			en: "CryptoFalka report on Bitstamp's service restrictions in Hungary due to legislative changes.",
		},
	},
	"bitstamp-origo-2025-07": {
		title: { hu: "Origo", en: "Origo" },
		originalUrl: "https://www.origo.hu/gazdasag/2025/07/bitstamp-revolut-kriptovaluta-szolgaltatas",
		summary: {
			hu: "A Bitstamp leállította a digitális eszközök vételét és eladását magyar ügyfeleknek. A befizetés, kiutalás, staking és kölcsönzés továbbra is elérhető maradt.",
			en: "Bitstamp suspended buying and selling of digital assets for Hungarian customers. Deposits, withdrawals, staking, and lending remained available.",
		},
	},
	"kriptomat-official-2025-12-22": {
		title: { hu: "Kriptomat", en: "Kriptomat" },
		originalUrl: "https://kriptomat.io/temporary-suspension-of-trading-services-in-hungary/",
		summary: {
			hu: "A Kriptomat hivatalos közleménye: 2025. december 26-tól 23:00-tól ideiglenesen felfüggesztik a kereskedési szolgáltatásokat Magyarországon. A vétel, eladás, váltás, KriptoEarn és Intelligent Portfolios szünetel, de a kifizetések elérhetők maradnak.",
			en: "Official Kriptomat announcement: trading services temporarily suspended in Hungary from December 26, 2025 at 23:00 CET. Buy, sell, exchange, KriptoEarn, and Intelligent Portfolios paused, but withdrawals remain available.",
		},
	},
	"kriptomat-index-2025-12-25": {
		title: { hu: "Index.hu", en: "Index.hu" },
		originalUrl:
			"https://index.hu/gazdasag/2025/12/25/kriptopiac-kriptomat-kivonulas-magyarorszag-revolut-szabalyozas",
		summary: {
			hu: "Az Index beszámolója a Kriptomat magyarországi szolgáltatásainak felfüggesztéséről december 26-tól a szigorodó szabályozási környezet miatt.",
			en: "Index report on Kriptomat's suspension of Hungarian services from December 26 due to stricter regulatory environment.",
		},
	},
	"kriptomat-revb-2025-12-24": {
		title: { hu: "RevB.hu", en: "RevB.hu" },
		originalUrl: "https://revb.hu/karacsonyi-sokk-a-magyar-kriptopiacon-a-kriptomat-is-bedobja-a-torolkozot/",
		summary: {
			hu: "A RevB beszámolója: a Kriptomat is felfüggeszti magyarországi szolgáltatásait december 26-tól, annak ellenére, hogy december 19-én elindult az első validátor.",
			en: "RevB report: Kriptomat also suspends Hungarian services from December 26, despite the first validator launching on December 19.",
		},
	},
	"kriptomat-privatbankar-2025-12-25": {
		title: { hu: "Privátbankár.hu", en: "Privátbankár.hu" },
		originalUrl:
			"https://privatbankar.hu/cikkek/vallalat/eros-kritika-nagy-martoneknak-a-kriptoceg-labbal-szavaz.html",
		summary: {
			hu: "A Privátbankár beszámolója a Kriptomat magyarországi szolgáltatásainak felfüggesztéséről december 26-tól 23:00-tól.",
			en: "Privátbankár report on Kriptomat's suspension of Hungarian services from December 26 at 23:00 CET.",
		},
	},
	"bitvavo-support-2025-12": {
		title: { hu: "Bitvavo Súgó", en: "Bitvavo Help Center" },
		originalUrl:
			"https://support.bitvavo.com/hc/en-us/articles/42230921168145-Why-are-Bitvavo-services-being-suspended-for-Hungarian-residents",
		summary: {
			hu: "A Bitvavo hivatalos tájékoztatója a magyarországi szolgáltatások felfüggesztéséről. December 26-tól (17:00 CET) a kereskedés és befizetés nem lehetséges, csak kifizetés és kriptó átutalás külső tárcába.",
			en: "Official Bitvavo announcement on the suspension of services for Hungarian residents. From December 26 (17:00 CET), trading and deposits are disabled, only withdrawals and crypto transfers to external wallets remain available.",
		},
	},
	"bitcoinbazis-caduceus": {
		title: { hu: "BitcoinBázis", en: "BitcoinBázis" },
		originalUrl: "https://www.bitcoinbazis.hu/kriptovaluta-validacio-magyarorszag-velemenyek/",
		summary: {
			hu: "Részletes elemzés a Caduceus-ről, Magyarország egyetlen kriptovaluta validátoráról. A cég háttere, vezetősége, a Vesszős család kapcsolatai és a közösségi reakciók.",
			en: "Detailed analysis of Caduceus, Hungary's only cryptocurrency validator. Company background, leadership, Vesszős family connections, and community reactions.",
		},
	},
	"caduceus-cegbetekintes": {
		title: { hu: "Caduceus Zrt. cégbetekintés", en: "Caduceus Zrt. Company Overview" },
		originalUrl: "https://www.e-cegjegyzek.hu/?cegadatlap/0110143354/Cegbetekintes",
		summary: {
			hu: "A Caduceus Zrt. ingyenes céginformációi. Cégjegyzékszám: 01-10-143354. Székhely: 1039 Budapest, Zöld utca 2. Jegyzett tőke: 100 000 000 Ft. Főtevékenység: IT szaktanácsadás.",
			en: "Free company information for Caduceus Zrt. Registration number: 01-10-143354. Headquarters: 1039 Budapest, Zöld utca 2. Registered capital: 100,000,000 HUF. Main activity: IT consulting.",
		},
	},
	"caduceus-cegkozlony": {
		title: { hu: "Caduceus Zrt. cégközlöny", en: "Caduceus Zrt. Company Gazette" },
		originalUrl: "https://cegkozlony.hu/lista/cegnev/2485523",
		summary: {
			hu: "A Caduceus Zrt. Cégközlönyben megjelent bejegyzései.",
			en: "Caduceus Zrt. entries published in the Company Gazette.",
		},
	},
	"caduceus-cegkivonat": {
		title: { hu: "Caduceus Zrt. tárolt cégkivonat", en: "Caduceus Zrt. Company Extract" },
		originalUrl: "https://www.e-cegjegyzek.hu/?cegadatlap/0110143354/TaroltCegkivonat",
		summary: {
			hu: "A Caduceus Zártkörűen Működő Részvénytársaság hivatalos cégkivonata. Bejegyezve: 2025.07.25. Székhely: 1039 Budapest, Zöld utca 2. Jegyzett tőke: 100 000 000 Ft. Többségi tulajdonos és igazgatóság elnöke: Vesszős Bence Marcell.",
			en: "Official company registry extract for Caduceus Zrt. Registered: 2025.07.25. Headquarters: 1039 Budapest, Zöld utca 2. Registered capital: 100,000,000 HUF. Majority owner and chairman: Bence Marcell Vesszős.",
		},
		text: {
			hu: `Caduceus Zártkörűen Működő Részvénytársaság (Caduceus Zrt.)
Cégjegyzékszám: 01-10-143354
Bejegyezve: 2025.07.25.
Székhely: 1039 Budapest, Zöld utca 2.
Adószám: 32858187-2-41
Jegyzett tőke: 100 000 000 HUF

Létesítő okirat kelte: 2025. július 11.

Főtevékenység: 6220 - Információtechnológiai szaktanácsadás és számítástechnikai eszközök, rendszerek üzemeltetése

Igazgatóság elnöke (önálló képviselet): Vesszős Bence Marcell (szül: 1993.06.16.)
Igazgatósági tag (együttes képviselet): Hatvani Andrea (szül: 1977.12.29.)
Igazgatósági tag (együttes képviselet): Kollár József (szül: 1986.06.16.)

Felügyelőbizottsági tagok:
- Dr. Vida Marianna Sarolta
- Dr. Vámosi-Nagy Zsolt
- Dr. Szécsényi István

Részvényes (50%+ szavazati jog): Vesszős Bence Marcell

Könyvvizsgáló: CORRECT Pénzügyi-és Könyvszakértő Kft.`,
			en: `Caduceus Private Limited Company (Caduceus Zrt.)
Company registration number: 01-10-143354
Registered: 2025.07.25.
Headquarters: 1039 Budapest, Zöld utca 2.
Tax number: 32858187-2-41
Registered capital: 100,000,000 HUF

Founding document date: July 11, 2025

Main activity: 6220 - IT consulting and operation of computing equipment and systems

Chairman of the Board (independent representation): Bence Marcell Vesszős (born: 1993.06.16.)
Board member (joint representation): Andrea Hatvani (born: 1977.12.29.)
Board member (joint representation): József Kollár (born: 1986.06.16.)

Supervisory Board members:
- Dr. Marianna Sarolta Vida
- Dr. Zsolt Vámosi-Nagy
- Dr. István Szécsényi

Shareholder (50%+ voting rights): Bence Marcell Vesszős

Auditor: CORRECT Financial and Accounting Expert Ltd.`,
		},
	},
	"caduceus-weboldal": {
		title: { hu: "Caduceus weboldal", en: "Caduceus Website" },
		originalUrl: "https://caduceus.hu/",
		summary: {
			hu: "Caduceus hivatalos weboldala. A 2025. december 19-én indított oldal minimális információt tartalmaz: bejelentkezési portál, ÁSZF és elérhetőség. EU-s előírásoknak megfelelő adatvédelmi szabályzat nincs.",
			en: "Official Caduceus website. Launched on December 19, 2025, the site contains minimal information: login portal, terms of service, and contact details. No EU-compliant privacy policy is available.",
		},
	},
	"parlament-szavazas-11922": {
		title: { hu: "Szavazás lekérdezés T/11922", en: "Vote Query T/11922" },
		originalUrl:
			"https://www.parlament.hu/web/guest/szavazasok-adott-idoszakban?p_p_id=hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_auth=c2yHA3iZ&_hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8_pairAction=%2Finternet%2Fcplsql%2Fogy_szav.szav_lap_egy%3Fp_szavdatum%3D2025.06.17.14%3A40%3A29%26p_szavkepv%3DI%26p_szavkpvcsop%3DI%26p_ckl%3D42%26p_osszefuz%3DI",
		summary: {
			hu: "A T/11922 törvényjavaslat szavazási eredményeinek lekérdezése a Parlament.hu oldalon.",
			en: "Vote query results for the T/11922 bill on Parlament.hu.",
		},
	},
	"moonpay-unsupported-countries": {
		title: { hu: "MoonPay nem támogatott országok", en: "MoonPay Unsupported Countries" },
		originalUrl: "https://support.moonpay.com/en/articles/380968-moonpay-s-unsupported-countries",
		summary: {
			hu: "A MoonPay hivatalos listája a nem támogatott országokról. Magyarország szerepel a listán, a MoonPay szolgáltatásai nem elérhetők magyar ügyfelek számára.",
			en: "MoonPay's official list of unsupported countries. Hungary is on the list, meaning MoonPay services are not available to Hungarian customers.",
		},
	},
	"telex-kripto-2025-12-25": {
		title: { hu: "Telex", en: "Telex" },
		originalUrl: "https://telex.hu/gazdasag/2025/12/25/kripto-sztfh-legalis-magyar-kereskedelem",
		summary: {
			hu: "A Telex összefoglalója a december 27-től érvényes kriptoeszköz-szabályozásról. A cikk áttekinti, hogy mit szabad és mit nem a magyar kriptopiac szereplőinek az új szabályok szerint.",
			en: "Telex summary of crypto-asset regulations effective from December 27. The article reviews what is and isn't allowed for Hungarian crypto market participants under the new rules.",
		},
	},
	"cryptofalka-szabalyozas-2026": {
		title: { hu: "CryptoFalka", en: "CryptoFalka" },
		originalUrl:
			"https://cryptofalka.hu/blokklanc/magyar-kripto-szabalyozas-2026-mit-szabad-mit-nem-maganszemelykent",
		summary: {
			hu: "A CryptoFalka elemzése a 2026-os kriptoszabályozásról és a december 27-i alkalmazási határidőről. Részletezi, hogy magánszemélyként mi engedélyezett és mi tiltott.",
			en: "CryptoFalka analysis of 2026 crypto regulations and the December 27 application deadline. Details what is permitted and prohibited for private individuals.",
		},
	},
	"hvg-kripto-2026-01-08": {
		title: { hu: "HVG", en: "HVG" },
		originalUrl: "https://hvg.hu/gazdasag/20260108_ujabb-kriptoszolgaltatas-all-le-magyarorszagon",
		summary: {
			hu: "A HVG beszámolója újabb kriptoszolgáltatások magyarországi leállásáról a szabályozási környezet miatt.",
			en: "HVG report on more cryptocurrency services shutting down in Hungary due to the regulatory environment.",
		},
	},
	"vsbz-wikilegia": {
		title: { hu: "Valid Since Block Zero (VSBZ)", en: "Valid Since Block Zero (VSBZ)" },
		originalUrl: "https://vsbz.wikilegia.org/",
		summary: {
			hu: "Közösségi tudásbázis a 2025. évi LXVII. törvény szerinti kriptoeszköz-validálási kötelezettségről. A weboldal kérdéseket, e-mail sablonokat, anonimizált eseteket és piaci elemzéseket tartalmaz. Közreműködés GitHub pull requesteken keresztül lehetséges. A tartalom nem minősül jogi tanácsadásnak.",
			en: "Community knowledge base about crypto-asset validation requirements under Act LXVII of 2025. The website contains questions, email templates, anonymized cases, and market analyses. Contributions are possible via GitHub pull requests. The content does not constitute legal advice.",
		},
	},
	"ahang-peticio-2025-07-08": {
		title: {
			hu: '"A Kriptovaluta nem bűntény!" petíció',
			en: '"Cryptocurrency is Not a Crime!" petition',
		},
		originalUrl: "https://szabad.ahang.hu/petitions/a-kriptovaluta-nem-bunteny",
		summary: {
			hu: "Civil petíció az Országgyűléshez, amely a kriptovaluta-szabályozás felülvizsgálatát kéri.",
			en: "Civil petition to the Parliament requesting a review of cryptocurrency regulation.",
		},
	},
	"parlament-k-13436": {
		title: {
			hu: "K/13436 Írásbeli kérdés (PDF)",
			en: "K/13436 Written Question (PDF)",
		},
		originalUrl: "https://www.parlament.hu/irom42/13436/13436.pdf",
		summary: {
			hu: "Szabadi István (Mi Hazánk) írásbeli kérdése Orbán Viktor miniszterelnökhöz a kriptoeszköz-szabályozásról. A kérdés arra keresi a választ, miért kriminalizáltak mintegy 500 000 magyar állampolgárt az új szabályozással.",
			en: "Written question from István Szabadi (Our Homeland Movement) to Prime Minister Viktor Orbán about crypto-asset regulation. The question asks why approximately 500,000 Hungarian citizens were criminalized by the new regulation.",
		},
		text: {
			hu: `Írásbeli választ igénylő kérdés címe: "A kriptoeszközökre vonatkozó új szabályozással miért kriminalizálnak mintegy 500.000 magyar állampolgárt?"

A Pártunkhoz érkezett bejelentések alapján az új szabályozás sürgős rendezést kíván, tekintettel arra, hogy a becslések szerint 500.000 magyar állampolgárt érint, akiknek jelenleg nincs lehetőségük a törvénynek való megfelelésre.

Kifogás merült fel azzal kapcsolatban, hogy a "validáló szolgáltató" fogalma kizárólag magyar sajátosság, sem az uniós MiCA-rendelet, sem a nemzetközi kriptoszektor nem ismeri. Jelenleg egyetlen validáló szolgáltató szerepel az SZTFH nyilvántartásában, egy újonnan alapított, a szakmában ismeretlen, minimális kapacitású cég.

Kérdések:
1. Tervezi-e a kormány végrehajtási moratórium bevezetését?
2. Jogszerűen átválthat-e magánszemély kriptoeszközt, ha nincs elérhető validátor?
3. Készült-e hatásvizsgálat a jogbizonytalanságról?
4. Mi indokolja, hogy MiCA-engedélyes szolgáltató nem nyújthat szolgáltatást hazai validáció nélkül?
5. Vizsgálta-e a kormány az árfolyam- vagy kényszerértékesítés okozta veszteségeket?`,
			en: `Title of written question: "Why does the new crypto-asset regulation criminalize approximately 500,000 Hungarian citizens?"

Based on reports received by our party, the new regulation requires urgent resolution, as it affects an estimated 500,000 Hungarian citizens who currently have no means of complying with the law.

Objections have been raised that the concept of "validation service provider" is uniquely Hungarian - neither the EU MiCA regulation nor the international crypto sector recognizes it. Currently only one validation service provider is registered with SZTFH, a newly founded company unknown in the industry with minimal capacity.

Questions:
1. Does the government plan to introduce an implementation moratorium?
2. Can a private individual legally convert crypto-assets if no validator is available?
3. Was an impact assessment conducted regarding legal uncertainty?
4. Why can't a MiCA-licensed provider offer services without domestic validation?
5. Has the government examined losses caused by exchange rate changes or forced sales?`,
		},
	},
	"parlament-k-13436-oldal": {
		title: {
			hu: "K/13436 Iromány adatai (Parlament.hu)",
			en: "K/13436 Document Details (Parlament.hu)",
		},
		originalUrl:
			"https://www.parlament.hu/web/guest/iromanyok-lekerdezese?p_p_id=hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_auth=b4UOp1AR&_hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8_pairAction=%2Finternet%2Fcplsql%2Fogy_irom.irom_adat%3Fp_ckl%3D42%26p_izon%3D13436",
		summary: {
			hu: "Szabadi István (Mi Hazánk) K/13436 számú írásbeli kérdésének iromány adatai a Parlament.hu oldalon. A kérdés állapotának és válaszának nyomon követésére szolgáló oldal.",
			en: "Document details for István Szabadi's (Our Homeland Movement) written question K/13436 on Parlament.hu. Page for tracking the status and response to the question.",
		},
	},
	"parlament-k-13444": {
		title: {
			hu: "K/13444 Írásbeli kérdés (PDF)",
			en: "K/13444 Written Question (PDF)",
		},
		originalUrl: "https://www.parlament.hu/irom42/13444/13444.pdf",
		summary: {
			hu: "Gelencsér Ferenc (Momentum) írásbeli kérdése Orbán Viktor miniszterelnökhöz a kriptoeszköz-szabályozásról. A kérdés a végrehajtási moratórium bevezetésének lehetőségét firtatja.",
			en: "Written question from Ferenc Gelencsér (Momentum) to Prime Minister Viktor Orbán about crypto-asset regulation. The question asks about the possibility of introducing an implementation moratorium.",
		},
		text: {
			hu: `Írásbeli választ igénylő kérdés címe: "Mi a valóság a kriptovaluták ügyében?"

A kriptoeszközökre vonatkozó új szabályozás, melyet a 2025. évi LXVII. törvény vezetett be, és 2025 júliusában lépett hatályba, a becslések szerint 500 000 magyar állampolgárt érint, és jelenleg az állampolgároknak nincs lehetőségük a törvénynek való megfelelésre. A Szabályozott Tevékenységek Felügyeleti Hatóságának (SZTFH) vonatkozó rendelete 2025. december 29-től alkalmazandó.

A jogszabályok által rögzített „validáló szolgáltató" fogalma kizárólag magyar sajátosság - sem az uniós MiCA-rendelet, sem a nemzetközi kriptoszektor nem ismeri. Jelenleg egyetlen validáló szolgáltató szerepel az SZTFH nyilvántartásában - egy újonnan alapított, a szakmában ismeretlen, minimális kapacitású cég. A szabályozás hatálybalépése óta több jelentős, uniós engedéllyel rendelkező szolgáltató hagyta el a magyar piacot. A törvény büntetőjogi következményeket fűz olyan tevékenységekhez, amelyek pontos tartalma nincs tisztázva.

Kérdés: Tervezi-e a Kormány kormányrendelet kiadását a 2025. évi LXVII. törvény kriptoeszközökre vonatkozó rendelkezéseinek végrehajtási moratóriumáról, amíg legalább több validáló szolgáltató nem áll rendelkezésre a piacon, és amíg az SZTFH nyilvános, gyakorlati útmutatót nem tesz közzé a validálás pontos eljárásáról?`,
			en: `Title of written question: "What is the reality regarding cryptocurrencies?"

The new regulation on crypto-assets, introduced by Act LXVII of 2025 and effective from July 2025, affects an estimated 500,000 Hungarian citizens who currently have no means of complying with the law. The relevant regulation of the Regulated Activities Supervisory Authority (SZTFH) is applicable from December 29, 2025.

The concept of "validation service provider" established by law is uniquely Hungarian - neither the EU MiCA regulation nor the international crypto sector recognizes it. Currently only one validation service provider is registered with SZTFH - a newly founded company unknown in the industry with minimal capacity. Since the regulation came into effect, several major EU-licensed providers have left the Hungarian market. The law attaches criminal consequences to activities whose exact content has not been clarified.

Question: Does the Government plan to issue a government decree on an implementation moratorium for the crypto-asset provisions of Act LXVII of 2025, until at least more validation service providers become available on the market, and until SZTFH publishes public, practical guidance on the exact validation procedure?`,
		},
	},
	"parlament-k-13444-oldal": {
		title: {
			hu: "K/13444 Iromány adatai (Parlament.hu)",
			en: "K/13444 Document Details (Parlament.hu)",
		},
		originalUrl:
			"https://www.parlament.hu/web/guest/iromanyok-lekerdezese?p_p_id=hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_auth=b4UOp1AR&_hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8_pairAction=%2Finternet%2Fcplsql%2Fogy_irom.irom_adat%3Fp_ckl%3D42%26p_izon%3D13444",
		summary: {
			hu: "Gelencsér Ferenc (Momentum) K/13444 számú írásbeli kérdésének iromány adatai a Parlament.hu oldalon. A kérdés állapotának és válaszának nyomon követésére szolgáló oldal.",
			en: "Document details for Ferenc Gelencsér's (Momentum) written question K/13444 on Parlament.hu. Page for tracking the status and response to the question.",
		},
	},
	"parlament-k-13426": {
		title: {
			hu: "K/13426 Írásbeli kérdés (PDF)",
			en: "K/13426 Written Question (PDF)",
		},
		originalUrl: "https://www.parlament.hu/irom42/13426/13426.pdf",
		summary: {
			hu: "Varju László (DK) írásbeli kérdése Orbán Viktor miniszterelnökhöz a kriptoeszköz-szabályozásról. A kérdés 8 pontban vizsgálja a validáló szolgáltatói rendszer problémáit, beleértve a versenyjogi és nemzetbiztonsági aggályokat.",
			en: "Written question from László Varju (DK) to Prime Minister Viktor Orbán about crypto-asset regulation. The question examines in 8 points the problems of the validation service provider system, including competition law and national security concerns.",
		},
		text: {
			hu: `Írásbeli választ igénylő kérdés címe: "Biztosított-e a kriptoeszközök átváltásának jogszerű és folyamatos végrehajtása, valamint a tisztességes verseny a 2025. évi LXVII. törvény alkalmazásában, különös tekintettel a validáló szolgáltatókra vonatkozó problémák tükrében?"

A szabályozás becslések szerint mintegy 500 000 magyar állampolgárt érint, ugyanakkor a jogkövető magatartás gyakorlati feltételei jelenleg nem biztosítottak. Az SZTFH nyilvántartása szerint jelenleg mindössze egyetlen, rövid ideje alapított, korlátozott kapacitású szolgáltató rendelkezik engedéllyel, miközben több, uniós engedéllyel működő jelentős piaci szereplő elhagyta a magyar piacot.

Kérdések:
1. Tervezi-e a Kormány végrehajtási moratórium bevezetését?
2. Mikor tesz közzé az SZTFH részletes, gyakorlati útmutatót?
3. Tervez-e az SZTFH átmeneti iránymutatást kiadni?
4. Milyen intézkedéseket tervez a Kormány a validáló szolgáltatók körének bővítésére?
5. Hogyan biztosítja a Kormány, hogy ne alakuljon ki kvázi-monopólium?
6. Vizsgálta-e a Gazdasági Versenyhivatal a rendszert?
7. Milyen kapacitásvizsgálatot végzett az SZTFH?
8. Vizsgálták-e a nemzetbiztonsági kockázatokat?`,
			en: `Title of written question: "Is the lawful and continuous execution of crypto-asset exchange and fair competition ensured in the application of Act LXVII of 2025, particularly in light of the problems regarding validation service providers?"

The regulation affects an estimated 500,000 Hungarian citizens, while the practical conditions for lawful conduct are currently not ensured. According to SZTFH's registry, currently only one recently founded provider with limited capacity holds a license, while several major EU-licensed market players have left the Hungarian market.

Questions:
1. Does the Government plan to introduce an implementation moratorium?
2. When will SZTFH publish detailed, practical guidance?
3. Does SZTFH plan to issue transitional guidance?
4. What measures does the Government plan to expand the pool of validation service providers?
5. How will the Government ensure no quasi-monopoly develops?
6. Has the Hungarian Competition Authority examined the system?
7. What capacity assessment did SZTFH conduct?
8. Were national security risks examined?`,
		},
	},
	"parlament-k-13426-oldal": {
		title: {
			hu: "K/13426 Iromány adatai (Parlament.hu)",
			en: "K/13426 Document Details (Parlament.hu)",
		},
		originalUrl:
			"https://www.parlament.hu/web/guest/iromanyok-lekerdezese?p_p_id=hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_auth=b4UOp1AR&_hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8_pairAction=%2Finternet%2Fcplsql%2Fogy_irom.irom_adat%3Fp_ckl%3D42%26p_izon%3D13426",
		summary: {
			hu: "Varju László (DK) K/13426 számú írásbeli kérdésének iromány adatai a Parlament.hu oldalon. A kérdés állapotának és válaszának nyomon követésére szolgáló oldal.",
			en: "Document details for László Varju's (DK) written question K/13426 on Parlament.hu. Page for tracking the status and response to the question.",
		},
	},
	"uphold-non-supported-jurisdictions": {
		title: {
			hu: "Uphold nem támogatott országok",
			en: "Uphold Non-Supported Jurisdictions",
		},
		originalUrl: "https://support.uphold.com/hc/en-us/articles/360026786712-Non-Supported-Jurisdictions",
		archivedUrl:
			"https://web.archive.org/web/20250826112328/https://support.uphold.com/hc/en-us/articles/360026786712-Non-Supported-Jurisdictions",
		summary: {
			hu: 'Az Uphold hivatalos listája a nem támogatott és korlátozott országokról. Magyarország a "nem tudunk új fiókokat nyitni" kategóriában szerepel.',
			en: 'Uphold\'s official list of non-supported and restricted jurisdictions. Hungary is listed in the "unable to offer new accounts" category.',
		},
	},
	"swissborg-supported-countries": {
		title: {
			hu: "SwissBorg támogatott országok",
			en: "SwissBorg Supported Countries",
		},
		originalUrl: "https://swissborg.com/supported-countries",
		archivedUrl: "https://web.archive.org/web/20250618122859/https://swissborg.com/supported-countries",
		summary: {
			hu: "A SwissBorg hivatalos listája a támogatott országokról. Magyarország 2025 nyarán került le a listáról.",
			en: "SwissBorg's official list of supported countries. Hungary was removed from the list in summer 2025.",
		},
	},
	"nebeus-restricted-countries": {
		title: {
			hu: "Nebeus korlátozott országok",
			en: "Nebeus Restricted Countries",
		},
		originalUrl: "https://support.nebeus.com/portal/en/kb/articles/countries-eligible-for-nebeus-account-creation",
		summary: {
			hu: "A Nebeus hivatalos listája a korlátozott országokról. Magyarország szerepel a listán, ahol nem hozható létre Nebeus fiók.",
			en: "Nebeus's official list of restricted countries. Hungary is on the list where Nebeus account creation is not allowed.",
		},
	},
	"parlament-k-13448": {
		title: {
			hu: "K/13448 Írásbeli kérdés (PDF)",
			en: "K/13448 Written Question (PDF)",
		},
		originalUrl: "https://www.parlament.hu/irom42/13448/13448.pdf",
		summary: {
			hu: "Tordai Bence (Párbeszéd) írásbeli kérdése Nagy Márton István nemzetgazdasági miniszterhez a kriptoeszköz-validálásról. A kérdés a végrehajtási moratórium bevezetésének lehetőségét és a magyar validátor szükségességét firtatja a MiCA-szabályozás tükrében.",
			en: "Written question from Bence Tordai (Dialogue) to Minister of National Economy Márton István Nagy about crypto-asset validation. The question asks about introducing an implementation moratorium and the necessity of Hungarian validators in light of MiCA regulation.",
		},
		text: {
			hu: `Írásbeli választ igénylő kérdés címe: "Terveznek moratóriumot elrendelni a kriptoeszközök validálására vonatkozóan, tekintettel a gyakorlati tapasztalatokra?"

A 2025. évi LXVII. törvény a kriptoeszközök szabályozásáról 2025 júliusában lépett hatályba, azonban az SZTFH-rendeletet 2025. októberében adták ki. Tekintettel arra, hogy a „validáló szolgáltató" fogalma kizárólag magyar sajátosság, és jelenleg csak egy, a szakmában ismeretlen, minimális kapacitású cég szerepel a nyilvántartásban, a törvénynek való megfelelés jelenleg gyakorlatilag lehetetlen.

Kérdések:
1. Tervezik kormányrendelet kiadását a végrehajtási moratóriumról, amíg több validáló szolgáltató nem áll rendelkezésre a piacon, és amíg az SZTFH nem tesz közzé gyakorlati útmutatót a validáló szolgáltatás pontos menetéről?
2. Miért van szükség a magyar validáló szolgáltatóra, miközben a MiCA-reguláció a centralizált tőzsdéket is kötelezi a validáló által végzett ellenőrzés elvégzésére?`,
			en: `Title of written question: "Are you planning to order a moratorium on crypto-asset validation, given the practical experiences?"

Act LXVII of 2025 on crypto-asset regulation came into effect in July 2025, but the SZTFH regulation was issued in October 2025. Given that the concept of "validation service provider" is uniquely Hungarian, and currently only one company unknown in the industry with minimal capacity is registered, compliance with the law is practically impossible.

Questions:
1. Is the government planning to issue a government decree on an implementation moratorium until more validation service providers become available on the market, and until SZTFH publishes practical guidance on the exact validation procedure?
2. Why is a Hungarian validation service provider necessary when MiCA regulation also requires centralized exchanges to perform the same checks that validators would perform?`,
		},
	},
	"parlament-k-13448-oldal": {
		title: {
			hu: "K/13448 Iromány adatai (Parlament.hu)",
			en: "K/13448 Document Details (Parlament.hu)",
		},
		originalUrl:
			"https://www.parlament.hu/web/guest/iromanyok-lekerdezese?p_p_id=hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_auth=IHukihld&_hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8_pairAction=%2Finternet%2Fcplsql%2Fogy_irom.irom_adat%3Fp_ckl%3D42%26p_izon%3D13448",
		summary: {
			hu: "Tordai Bence (Párbeszéd) K/13448 számú írásbeli kérdésének iromány adatai a Parlament.hu oldalon. A kérdés állapotának és válaszának nyomon követésére szolgáló oldal.",
			en: "Document details for Bence Tordai's (Dialogue) written question K/13448 on Parlament.hu. Page for tracking the status and response to the question.",
		},
	},
} as const;

export type SourceSlug = keyof typeof sources;
