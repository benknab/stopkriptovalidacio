import { type Signal, useSignal, useSignalEffect } from "@preact/signals";

type BooleanParamConfig = {
	key: string;
	defaultValue: boolean;
	initialValue: boolean;
};

export function useBooleanQueryParam(config: BooleanParamConfig): Signal<boolean> {
	const signal = useSignal(config.initialValue);

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
