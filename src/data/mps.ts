export type VoteType = "yes" | "no" | "abstain" | "absent" | "not_voted" | "banned";

export type Party =
	| "Fidesz"
	| "KDNP"
	| "DK"
	| "Momentum"
	| "MSZP"
	| "Jobbik"
	| "Mi Hazánk"
	| "Párbeszéd"
	| "független"
	| "nemzetiségi";

export type Mp = {
	name: string;
	party: Party;
	vote: VoteType;
	emails: Set<string>;
	district?: string;
	phone?: string;
};

export type MpSlug = keyof typeof mps;

// Helper to convert Hungarian characters to ASCII for email
function toAscii(str: string): string {
	return str
		.toLowerCase()
		.replace(/á/g, "a")
		.replace(/é/g, "e")
		.replace(/í/g, "i")
		.replace(/ó/g, "o")
		.replace(/ö/g, "o")
		.replace(/ő/g, "o")
		.replace(/ú/g, "u")
		.replace(/ü/g, "u")
		.replace(/ű/g, "u");
}

// Generate parliament email from Hungarian name
// Format: firstname.lastname@parlament.hu
function generateEmail(name: string): string {
	// Remove "Dr." prefix and clean up
	let cleanName = name
		.replace(/^Dr\.\s*/i, "")
		.replace(/\s+Dr\.\s+/i, " ")
		.replace(/né\s+Dr\.\s+/i, "né ");

	// Split into parts
	const parts = cleanName.split(/\s+/);

	// Handle single-letter prefixes like "F." "V." "Z." "Gy."
	let lastName = parts[0];
	let firstNames: string[];

	if (parts[0].match(/^[A-ZÁÉÍÓÖŐÚÜŰ]{1,2}\.$/)) {
		// First part is initial like "F." or "Gy."
		lastName = parts[0].replace(".", "") + parts[1];
		firstNames = parts.slice(2);
	} else {
		lastName = parts[0];
		firstNames = parts.slice(1);
	}

	// Convert to ASCII and format
	const firstNamePart = firstNames.map((n) => toAscii(n)).join(".");
	const lastNamePart = toAscii(lastName);

	return `${firstNamePart}.${lastNamePart}@parlament.hu`;
}

// Helper to create Mp with generated email
function mp(name: string, party: Party, vote: VoteType, district?: string): Mp {
	return {
		name,
		party,
		vote,
		emails: new Set([generateEmail(name)]),
		district,
	};
}

export const mps = {
	"agh-peter": mp("Ágh Péter", "Fidesz", "yes"),
	"balla-gyorgy": mp("Balla György", "Fidesz", "not_voted"),
	"balla-mihaly": mp("Balla Mihály", "Fidesz", "yes"),
	"banki-erik": mp("Bánki Erik", "Fidesz", "yes"),
	"banyai-gabor": mp("Bányai Gábor", "Fidesz", "yes"),
	"barcza-attila": mp("Barcza Attila", "Fidesz", "yes"),
	"bartos-monika": mp("Bartos Mónika", "Fidesz", "yes"),
	"becso-zsolt": mp("Becsó Zsolt", "Fidesz", "yes"),
	"bencsik-janos": mp("Bencsik János", "Fidesz", "yes"),
	"bodo-sandor": mp("Bodó Sándor", "Fidesz", "yes"),
	"bona-zoltan": mp("Bóna Zoltán", "Fidesz", "yes"),
	"budai-gyula": mp("Dr. Budai Gyula", "Fidesz", "yes"),
	"cseresnyes-peter": mp("Cseresnyés Péter", "Fidesz", "yes"),
	"csibi-krisztina": mp("Dr. Csibi Krisztina", "Fidesz", "yes"),
	"csobor-katalin": mp("Csöbör Katalin", "Fidesz", "yes"),
	"csuzda-gabor": mp("Dr. Csuzda Gábor", "Fidesz", "yes"),
	"czervan-gyorgy": mp("Czerván György", "Fidesz", "yes"),
	"czunyine-bertalan-judit": mp("Czunyiné Dr. Bertalan Judit", "Fidesz", "yes"),
	"danko-bela": mp("Dankó Béla", "Fidesz", "yes"),
	"demeter-andras": mp("Dr. Demeter András", "Fidesz", "yes"),
	"demeter-zoltan": mp("Demeter Zoltán", "Fidesz", "yes"),
	"dunai-monika": mp("Dunai Mónika", "Fidesz", "yes"),
	"erdos-norbert": mp("Erdős Norbert", "Fidesz", "yes"),
	"eros-gabor": mp("Erős Gábor", "Fidesz", "yes"),
	"f-kovacs-sandor": mp("F. Kovács Sándor", "Fidesz", "yes"),
	"farkas-ors": mp("Farkas Örs", "Fidesz", "yes"),
	"farkas-sandor": mp("Farkas Sándor", "Fidesz", "yes"),
	"fazekas-sandor": mp("Dr. Fazekas Sándor", "Fidesz", "yes"),
	"ferencz-orsolya": mp("Dr. Ferencz Orsolya", "Fidesz", "yes"),
	"fonagy-janos": mp("Dr. Fónagy János", "Fidesz", "yes"),
	"font-sandor": mp("Font Sándor", "Fidesz", "yes"),
	"foldesi-gyula": mp("Földesi Gyula", "Fidesz", "yes"),
	"fulop-attila": mp("Fülöp Attila", "Fidesz", "yes"),
	"gelencser-attila": mp("Gelencsér Attila", "Fidesz", "yes"),
	"gulyas-gergely": mp("Gulyás Gergely", "Fidesz", "yes"),
	"gyoparos-alpar": mp("Gyopáros Alpár", "Fidesz", "yes"),
	"halasz-janos": mp("Halász János", "Fidesz", "yes"),
	"hegedus-barbara": mp("Dr. Hegedűs Barbara", "Fidesz", "yes"),
	"hejj-david": mp("Héjj Dávid", "Fidesz", "yes"),
	"herczeg-tamas": mp("Herczeg Tamás", "Fidesz", "yes"),
	"herczeg-zsolt": mp("Herczeg Zsolt", "Fidesz", "yes"),
	"hidveghi-balazs": mp("Hidvéghi Balázs", "Fidesz", "yes"),
	"hoppal-peter": mp("Dr. Hoppál Péter", "Fidesz", "yes"),
	"hornung-agnes": mp("Hornung Ágnes", "Fidesz", "yes"),
	"horvath-istvan": mp("Horváth István", "Fidesz", "yes"),
	"horvath-laszlo": mp("Horváth László", "Fidesz", "yes"),
	"horcsik-richard": mp("Dr. Hörcsik Richárd", "Fidesz", "yes"),
	"illes-boglarka": mp("Illés Boglárka", "Fidesz", "yes"),
	"jakab-istvan": mp("Jakab István", "Fidesz", "yes"),
	"kallai-maria": mp("Dr. Kállai Mária", "Fidesz", "yes"),
	"kara-akos": mp("Kara Ákos", "Fidesz", "yes"),
	"kiraly-nora": mp("Király Nóra", "Fidesz", "yes"),
	"kiss-janos": mp("Dr. Kiss János", "Fidesz", "yes"),
	"kocsis-mate": mp("Kocsis Máté", "Fidesz", "yes"),
	"koncz-zsofia": mp("Dr. Koncz Zsófia", "Fidesz", "yes"),
	"kontrat-karoly": mp("Kontrát Károly", "Fidesz", "yes"),
	"kosa-lajos": mp("Kósa Lajos", "Fidesz", "yes"),
	"kovacs-jozsef": mp("Dr. Kovács József", "Fidesz", "yes"),
	"kovacs-sandor": mp("Kovács Sándor", "Fidesz", "yes"),
	"kovacs-zsolt": mp("Kovács Zsolt", "Fidesz", "yes"),
	"kover-laszlo": mp("Kövér László", "Fidesz", "yes"),
	"kubatov-gabor": mp("Kubatov Gábor", "Fidesz", "yes"),
	"lang-zsolt": mp("Dr. Láng Zsolt", "Fidesz", "yes"),
	"lazar-janos": mp("Lázár János", "Fidesz", "yes"),
	"lezsak-sandor": mp("Lezsák Sándor", "Fidesz", "yes"),
	"matrai-marta": mp("Mátrai Márta", "Fidesz", "yes"),
	"menczer-tamas": mp("Menczer Tamás", "Fidesz", "yes"),
	"meszaros-lajos": mp("Dr. Mészáros Lajos", "Fidesz", "yes"),
	"molnar-agnes": mp("Dr. Molnár Ágnes", "Fidesz", "yes"),
	"nagy-balint": mp("Nagy Bálint", "Fidesz", "yes"),
	"nagy-csaba": mp("Nagy Csaba", "Fidesz", "yes"),
	"nagy-istvan": mp("Dr. Nagy István", "Fidesz", "not_voted"),
	"nemeth-szilard-istvan": mp("Németh Szilárd István", "Fidesz", "yes"),
	"nemeth-zsolt": mp("Németh Zsolt", "Fidesz", "yes"),
	"nyitrai-zsolt": mp("Nyitrai Zsolt", "Fidesz", "yes"),
	"orban-balazs": mp("Dr. Orbán Balázs", "Fidesz", "yes"),
	"orban-viktor": mp("Orbán Viktor", "Fidesz", "yes"),
	"ovadi-peter": mp("Ovádi Péter", "Fidesz", "yes"),
	"pajtok-gabor": mp("Dr. Pajtók Gábor", "Fidesz", "yes"),
	"panczel-karoly": mp("Pánczél Károly", "Fidesz", "yes"),
	"pesti-imre": mp("Dr. Pesti Imre", "Fidesz", "yes"),
	"pocs-janos": mp("Pócs János", "Fidesz", "yes"),
	"pogacsas-tibor": mp("Pogácsás Tibor", "Fidesz", "yes"),
	"posan-laszlo": mp("Dr. Pósán László", "Fidesz", "yes"),
	"riz-gabor": mp("Riz Gábor", "Fidesz", "yes"),
	"rogan-antal": mp("Rogán Antal", "Fidesz", "yes"),
	"salacz-laszlo": mp("Dr. Salacz László", "Fidesz", "yes"),
	"selmeczi-gabriella": mp("Dr. Selmeczi Gabriella", "Fidesz", "yes"),
	"simon-miklos": mp("Dr. Simon Miklós", "Fidesz", "yes"),
	"simon-robert-balazs": mp("Simon Róbert Balázs", "Fidesz", "yes"),
	"szabo-tunde": mp("Dr. Szabó Tünde", "Fidesz", "yes"),
	"szabo-zsolt": mp("Szabó Zsolt", "Fidesz", "yes"),
	"szatmary-kristof": mp("Szatmáry Kristóf", "Fidesz", "yes"),
	"szeberenyi-gyula-tamas": mp("Dr. Szeberényi Gyula Tamás", "Fidesz", "yes"),
	"szijjarto-peter": mp("Szijjártó Péter", "Fidesz", "not_voted"),
	"sztojka-attila": mp("Sztojka Attila", "Fidesz", "yes"),
	"szucs-lajos": mp("Dr. Szűcs Lajos", "Fidesz", "yes"),
	"tallai-andras": mp("Tállai András", "Fidesz", "yes"),
	"tapolczai-gergely": mp("Dr. Tapolczai Gergely", "Fidesz", "yes"),
	"taso-laszlo": mp("Tasó László", "Fidesz", "yes"),
	"tessely-zoltan": mp("Tessely Zoltán", "Fidesz", "not_voted"),
	"tiba-istvan": mp("Dr. Tiba István", "Fidesz", "yes"),
	"tilki-attila": mp("Dr. Tilki Attila", "Fidesz", "yes"),
	"toro-gabor": mp("Törő Gábor", "Fidesz", "yes"),
	"tuzson-bence": mp("Tuzson Bence", "Fidesz", "yes"),
	"v-nemeth-zsolt": mp("V. Németh Zsolt", "Fidesz", "yes"),
	"varga-gabor": mp("Varga Gábor", "Fidesz", "yes"),
	"vargha-tamas": mp("Vargha Tamás", "Fidesz", "yes"),
	"vecsey-laszlo": mp("Vécsey László", "Fidesz", "yes"),
	"vigh-laszlo": mp("Vigh László", "Fidesz", "yes"),
	"vinnai-gyozo": mp("Dr. Vinnai Győző", "Fidesz", "yes"),
	"vitalyos-eszter": mp("Vitályos Eszter", "Fidesz", "yes"),
	"vitanyi-istvan": mp("Dr. Vitányi István", "Fidesz", "yes"),
	"witzmann-mihaly": mp("Witzmann Mihály", "Fidesz", "yes"),
	"zsigmond-barna-pal": mp("Dr. Zsigmond Barna Pál", "Fidesz", "yes"),
	"zsigo-robert": mp("Zsigó Róbert", "Fidesz", "yes"),
	"aradszki-andras": mp("Dr. Aradszki András", "KDNP", "yes"),
	"foldi-laszlo": mp("Földi László", "KDNP", "yes"),
	"hargitai-janos": mp("Dr. Hargitai János", "KDNP", "yes"),
	"harrach-peter": mp("Harrach Péter", "KDNP", "yes"),
	"hollik-istvan": mp("Hollik István", "KDNP", "yes"),
	"juhasz-hajnalka": mp("Dr. Juhász Hajnalka", "KDNP", "yes"),
	"latorcai-janos": mp("Dr. Latorcai János", "KDNP", "yes"),
	"mihalffy-bela": mp("Mihálffy Béla", "KDNP", "yes"),
	"moring-jozsef-attila": mp("Móring József Attila", "KDNP", "yes"),
	"nacsa-lorinc": mp("Nacsa Lőrinc", "KDNP", "yes"),
	"navracsics-tibor": mp("Dr. Navracsics Tibor", "KDNP", "yes"),
	"retvari-bence": mp("Rétvári Bence", "KDNP", "yes"),
	"semjen-zsolt": mp("Dr. Semjén Zsolt", "KDNP", "yes"),
	"sesztak-miklos": mp("Dr. Seszták Miklós", "KDNP", "yes"),
	"simicsko-istvan": mp("Dr. Simicskó István", "KDNP", "yes"),
	"soltesz-miklos": mp("Soltész Miklós", "KDNP", "yes"),
	"suli-janos": mp("Süli János", "KDNP", "yes"),
	"szaszfalvi-laszlo": mp("Szászfalvi László", "KDNP", "yes"),
	"vejkey-imre": mp("Dr. Vejkey Imre", "KDNP", "yes"),
	"arato-gergely": mp("Arató Gergely", "DK", "no"),
	"barkoczi-balazs": mp("Barkóczi Balázs", "DK", "no"),
	"david-ferenc": mp("Dr. Dávid Ferenc", "DK", "no"),
	"foldi-judit": mp("Földi Judit", "DK", "no"),
	"greczy-zsolt": mp("Gréczy Zsolt", "DK", "no"),
	"gy-nemeth-erzsebet": mp("Gy. Németh Erzsébet", "DK", "no"),
	"hegedus-andrea": mp("Hegedüs Andrea", "DK", "no"),
	"kalman-olga": mp("Kálmán Olga", "DK", "no"),
	"komaromi-zoltan": mp("Dr. Komáromi Zoltán", "DK", "no"),
	"olah-lajos": mp("Dr. Oláh Lajos", "DK", "no"),
	"ronai-sandor": mp("Rónai Sándor", "DK", "no"),
	"sebian-petrovszki-laszlo": mp("Sebián-Petrovszki László", "DK", "absent"),
	"vadai-agnes": mp("Dr. Vadai Ágnes", "DK", "no"),
	"varga-zoltan": mp("Varga Zoltán", "DK", "no"),
	"varju-laszlo": mp("Varju László", "DK", "no"),
	"bedo-david": mp("Bedő Dávid", "Momentum", "banned"),
	"cseh-katalin": mp("Dr. Cseh Katalin", "Momentum", "no"),
	"gelencser-ferenc": mp("Gelencsér Ferenc", "Momentum", "absent"),
	"hajnal-miklos": mp("Hajnal Miklós", "Momentum", "absent"),
	"locsei-lajos": mp("Lőcsei Lajos", "Momentum", "banned"),
	"sebok-eva": mp("Sebők Éva", "Momentum", "banned"),
	"stummer-janos": mp("Stummer János", "Momentum", "not_voted"),
	"szabo-szabolcs": mp("Szabó Szabolcs", "Momentum", "no"),
	"tompos-marton-kristof": mp("Tompos Márton Kristóf", "Momentum", "no"),
	"toth-endre": mp("Tóth Endre", "Momentum", "absent"),
	"gurmai-zita": mp("Dr. Gurmai Zita", "MSZP", "no"),
	"harangozo-tamas": mp("Dr. Harangozó Tamás", "MSZP", "no"),
	"hiller-istvan": mp("Dr. Hiller István", "MSZP", "no"),
	"hiszekeny-dezso": mp("Hiszékeny Dezső", "MSZP", "absent"),
	"komjathi-imre": mp("Komjáthi Imre", "MSZP", "no"),
	"kunhalmi-agnes": mp("Kunhalmi Ágnes", "MSZP", "no"),
	"molnar-zsolt": mp("Dr. Molnár Zsolt", "MSZP", "absent"),
	"szabo-sandor": mp("Szabó Sándor", "MSZP", "no"),
	"toth-bertalan": mp("Dr. Tóth Bertalan", "MSZP", "no"),
	"vajda-zoltan": mp("Vajda Zoltán", "MSZP", "no"),
	"ander-balazs": mp("Ander Balázs", "Jobbik", "abstain"),
	"bencze-janos": mp("Bencze János", "Jobbik", "abstain"),
	"brenner-koloman": mp("Dr. Brenner Koloman", "Jobbik", "abstain"),
	"dudas-robert": mp("Dudás Róbert", "Jobbik", "abstain"),
	"lukacs-laszlo-gyorgy": mp("Dr. Lukács László György", "Jobbik", "abstain"),
	"sas-zoltan": mp("Sas Zoltán", "Jobbik", "abstain"),
	"z-karpat-daniel": mp("Z. Kárpát Dániel", "Jobbik", "abstain"),
	"apati-istvan": mp("Dr. Apáti István", "Mi Hazánk", "not_voted"),
	"docs-david": mp("Dócs Dávid", "Mi Hazánk", "not_voted"),
	"duro-dora": mp("Dúró Dóra", "Mi Hazánk", "abstain"),
	"novak-elod": mp("Novák Előd", "Mi Hazánk", "abstain"),
	"szabadi-istvan": mp("Szabadi István", "Mi Hazánk", "abstain"),
	"toroczkai-laszlo": mp("Toroczkai László", "Mi Hazánk", "abstain"),
	"berki-sandor": mp("Berki Sándor", "Párbeszéd", "no"),
	"jambor-andras-imre": mp("Jámbor András Imre", "Párbeszéd", "absent"),
	"mellar-tamas": mp("Dr. Mellár Tamás", "Párbeszéd", "no"),
	"szabo-rebeka": mp("Szabó Rebeka", "Párbeszéd", "no"),
	"szabo-timea": mp("Szabó Timea", "Párbeszéd", "no"),
	"tordai-bence": mp("Tordai Bence", "Párbeszéd", "no"),
	"bakos-bernadett": mp("Bakos Bernadett", "független", "no"),
	"balassa-peter": mp("Balassa Péter", "független", "no"),
	"csardi-antal": mp("Csárdi Antal", "független", "no"),
	"hadhazy-akos": mp("Dr. Hadházy Ákos", "független", "banned"),
	"jakab-peter": mp("Jakab Péter", "független", "not_voted"),
	"kanasz-nagy-mate": mp("Kanász-Nagy Máté", "független", "no"),
	"keresztes-laszlo-lorant": mp("Dr. Keresztes László Lóránt", "független", "no"),
	"ungar-peter": mp("Ungár Péter", "független", "absent"),
	"varga-ferenc": mp("Varga Ferenc", "független", "no"),
	"ritter-imre": mp("Ritter Imre", "nemzetiségi", "yes"),
} as const satisfies Record<string, Mp>;

export const voteSource = {
	label: "Szavazás lekérdezés T/11922",
	url: "https://www.parlament.hu/web/guest/szavazasok-adott-idoszakban?p_p_id=hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_auth=c2yHA3iZ&_hu_parlament_cms_pair_portlet_PairProxy_INSTANCE_9xd2Wc9jP4z8_pairAction=%2Finternet%2Fcplsql%2Fogy_szav.szav_lap_egy%3Fp_szavdatum%3D2025.06.17.14%3A40%3A29%26p_szavkepv%3DI%26p_szavkpvcsop%3DI%26p_ckl%3D42%26p_osszefuz%3DI",
};
