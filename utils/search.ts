// Keep the site's public query format: plain strings, including zero-padded districts.
export function parseSearch(search: string): Record<string, string> {
	return Object.fromEntries(new URLSearchParams(search));
}

export function stringifySearch(search: Record<string, unknown>): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(search)) {
		if (value !== undefined && value !== null) params.set(key, String(value));
	}
	const query = params.toString();
	return query ? `?${query}` : "";
}
