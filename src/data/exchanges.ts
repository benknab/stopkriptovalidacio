export type ExchangeStatus = "operating" | "leaving" | "unknown";

export type Exchange = {
	name: string;
	status: ExchangeStatus;
	leaveDate?: Date;
};

export const exchanges = {
	revolut: {
		name: "Revolut",
		status: "leaving",
		leaveDate: undefined,
	},
	strike: {
		name: "Strike",
		status: "leaving",
		leaveDate: new Date("2026-01-09"),
	},
	etoro: {
		name: "eToro",
		status: "leaving",
		leaveDate: new Date("2025-12-26"),
	},
	coincash: {
		name: "CoinCash",
		status: "leaving",
		leaveDate: new Date("2025-12-18"),
	},
	bitstamp: {
		name: "Bitstamp",
		status: "leaving",
		leaveDate: new Date("2025-07-09"),
	},
	kriptomat: {
		name: "Kriptomat",
		status: "leaving",
		leaveDate: new Date("2025-12-26"),
	},
	bitvavo: {
		name: "Bitvavo",
		status: "leaving",
		leaveDate: new Date("2025-12-26"),
	},
	coinbase: {
		name: "Coinbase",
		status: "unknown",
	},
	kraken: {
		name: "Kraken",
		status: "unknown",
	},
	binance: {
		name: "Binance",
		status: "unknown",
	},
	"crypto-com": {
		name: "Crypto.com",
		status: "unknown",
	},
	bitpanda: {
		name: "Bitpanda",
		status: "unknown",
	},
	bybit: {
		name: "Bybit",
		status: "unknown",
	},
	bitgo: {
		name: "BitGo",
		status: "unknown",
	},
	okcoin: {
		name: "OKCoin",
		status: "unknown",
	},
	okx: {
		name: "OKX",
		status: "unknown",
	},
	mrcoin: {
		name: "MrCoin",
		status: "unknown",
	},
	nexo: {
		name: "Nexo",
		status: "unknown",
	},
} as const satisfies Record<string, Exchange>;

export type ExchangeSlug = keyof typeof exchanges;
