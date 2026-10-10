import { sources } from "../data/sources.ts";
import { localizePath } from "./localized-path.ts";

export const PUBLIC_PAGE_PATHS = ["/", "/kriptovalidalas", "/szavazas", "/rolunk"];
export const FIRST_PARTY_SOURCE_PATHS = Object.entries(sources)
	.filter(([, source]) => !source.originalUrl && !source.internalUrl)
	.map(([slug]) => `/forras/${slug}`);
export const STATIC_PAGE_PATHS = [...PUBLIC_PAGE_PATHS, ...FIRST_PARTY_SOURCE_PATHS].flatMap((path) => [
	localizePath(path, "hu"),
	localizePath(path, "en"),
]);
