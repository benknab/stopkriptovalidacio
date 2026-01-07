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
} as const satisfies Record<string, Exchange>;

export type ExchangeSlug = keyof typeof exchanges;
