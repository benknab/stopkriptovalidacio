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
} as const satisfies Record<string, Exchange>;

export type ExchangeSlug = keyof typeof exchanges;
