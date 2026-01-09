import { type Signal, useSignal, useSignalEffect } from "@preact/signals";

type BooleanParamConfig = {
	key: string;
	defaultValue: boolean;
};

export function useBooleanQueryParam(config: BooleanParamConfig): Signal<boolean> {
	const getInitialValue = (): boolean => {
		if (typeof globalThis.location === "undefined") return config.defaultValue;
		const params = new URLSearchParams(globalThis.location.search);
		const value = params.get(config.key);
		if (value === null) return config.defaultValue;
		return value === "true";
	};

	const signal = useSignal(getInitialValue());

	useSignalEffect(() => {
		if (typeof globalThis.history === "undefined") return;
		const url = new URL(globalThis.location.href);

		if (signal.value !== config.defaultValue) {
			url.searchParams.set(config.key, String(signal.value));
		} else {
			url.searchParams.delete(config.key);
		}

		globalThis.history.replaceState({}, "", url);
	});

	return signal;
}
