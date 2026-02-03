export type ExchangeStatus = "operating" | "restricted" | "uncertain";

export type Exchange = {
	name: string;
	status: ExchangeStatus;
	leaveDate?: Date;
};

export const exchanges = {
	revolut: {
		name: "Revolut",
		status: "restricted",
		leaveDate: new Date("2025-12-18"),
	},
	strike: {
		name: "Strike",
		status: "restricted",
		leaveDate: new Date("2026-01-09"),
	},
	etoro: {
		name: "eToro",
		status: "restricted",
		leaveDate: new Date("2025-12-26"),
	},
	coincash: {
		name: "CoinCash",
		status: "restricted",
		leaveDate: new Date("2025-12-18"),
	},
	bitstamp: {
		name: "Bitstamp",
		status: "restricted",
		leaveDate: new Date("2025-07-09"),
	},
	kriptomat: {
		name: "Kriptomat",
		status: "restricted",
		leaveDate: new Date("2025-12-26"),
	},
	bitvavo: {
		name: "Bitvavo",
		status: "restricted",
		leaveDate: new Date("2025-12-26"),
	},
	coinbase: {
		name: "Coinbase",
		status: "uncertain",
	},
	kraken: {
		name: "Kraken",
		status: "uncertain",
	},
	binance: {
		name: "Binance",
		status: "uncertain",
	},
	"crypto-com": {
		name: "Crypto.com",
		status: "uncertain",
	},
	bitpanda: {
		name: "Bitpanda",
		status: "operating",
	},
	bybit: {
		name: "Bybit",
		status: "uncertain",
	},
	bitgo: {
		name: "BitGo",
		status: "uncertain",
	},
	okcoin: {
		name: "OKCoin",
		status: "uncertain",
	},
	okx: {
		name: "OKX",
		status: "uncertain",
	},
	mrcoin: {
		name: "MrCoin",
		status: "uncertain",
	},
	nexo: {
		name: "Nexo",
		status: "uncertain",
	},
	moonpay: {
		name: "MoonPay",
		status: "restricted",
		leaveDate: new Date("2026-01-02"),
	},
	uphold: {
		name: "Uphold",
		status: "restricted",
		leaveDate: new Date("2025-08-13"),
	},
	swissborg: {
		name: "SwissBorg",
		status: "restricted",
		leaveDate: new Date("2025-09-10"),
	},
	nebeus: {
		name: "Nebeus",
		status: "restricted",
		leaveDate: new Date("2026-01-07"),
	},
	gemini: {
		name: "Gemini",
		status: "uncertain",
	},
	kucoin: {
		name: "KuCoin",
		status: "uncertain",
	},
} as const satisfies Record<string, Exchange>;

export type ExchangeSlug = keyof typeof exchanges;
