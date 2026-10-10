import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";

type ParamConfig<T> = {
	key: string;
	defaultValue: T;
	initialValue: T;
};

const pendingUpdates = new WeakMap<object, Record<string, unknown>>();

// A county/district/representative change may set multiple keys in one event.
// Commit them together: separate navigations race while async route context loads.
function queueUpdate(
	router: object,
	currentSearch: Record<string, unknown>,
	key: string,
	value: string | boolean,
	defaultValue: string | boolean,
	commit: (search: Record<string, unknown>) => void,
): void {
	let search = pendingUpdates.get(router);
	if (!search) {
		search = { ...currentSearch };
		pendingUpdates.set(router, search);
		queueMicrotask(() => {
			const pending = pendingUpdates.get(router);
			pendingUpdates.delete(router);
			if (pending) commit(pending);
		});
	}
	if (value === defaultValue) delete search[key];
	else search[key] = value;
}

function useQuerySetter<T extends string | boolean>(config: ParamConfig<T>): (value: T) => void {
	const router = useRouter();
	const navigate = useNavigate();

	function commit(search: Record<string, unknown>): void {
		void navigate({
			to: ".",
			search,
			hash: (previous) => previous ?? "",
			replace: true,
			resetScroll: false,
		});
	}

	function setValue(value: T): void {
		queueUpdate(router, router.latestLocation.search, config.key, value, config.defaultValue, commit);
	}
	return setValue;
}

// Router-owned state stays in sync with hydration, reloads and back/forward navigation.
export function useBooleanQueryParam(config: ParamConfig<boolean>): [boolean, (value: boolean) => void] {
	const searchStr = useLocation({ select: (location) => location.searchStr });
	const setValue = useQuerySetter(config);
	const rawValue = new URLSearchParams(searchStr).get(config.key);
	const value =
		rawValue === null ? config.initialValue : config.defaultValue ? rawValue !== "false" : rawValue === "true";
	return [value, setValue];
}

export function useStringQueryParam(config: ParamConfig<string>): [string, (value: string) => void] {
	const searchStr = useLocation({ select: (location) => location.searchStr });
	const setValue = useQuerySetter(config);
	const value = new URLSearchParams(searchStr).get(config.key) ?? config.initialValue;
	return [value, setValue];
}
