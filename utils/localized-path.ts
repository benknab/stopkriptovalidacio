import type { SupportedLanguage } from "../i18n/index.ts";

export function getPathLanguage(path: string): SupportedLanguage {
	return /^\/en(?:\/|$|[?#])/.test(path) ? "en" : "hu";
}

export function stripLanguagePrefix(path: string): string {
	const barePath = path.replace(/^\/en(?=\/|$|[?#])/, "");
	return barePath.startsWith("/") ? barePath : `/${barePath}`;
}

// Only site-relative page links are localized; assets and external links stay untouched.
export function localizePath(path: string, lang: SupportedLanguage): string {
	if (!path.startsWith("/") || path.startsWith("//")) return path;
	const suffixStart = path.search(/[?#]/);
	const pathname = suffixStart === -1 ? path : path.slice(0, suffixStart);
	if (/\.[^/]+$/.test(pathname)) return path;
	const suffix = path.slice(pathname.length);
	// Cloudflare Pages serves the exported <path>/index.html at <path>/.
	const pagePath = `${stripLanguagePrefix(pathname).replace(/\/+$/, "")}/`;
	return `${lang === "en" ? "/en" : ""}${pagePath}${suffix}`;
}

export function getHomeAnchor(anchor: string, currentPath: string): string {
	const barePath = stripLanguagePrefix(currentPath).split(/[?#]/)[0];
	return barePath === "/" ? `#${anchor}` : `${localizePath("/", getPathLanguage(currentPath))}#${anchor}`;
}
