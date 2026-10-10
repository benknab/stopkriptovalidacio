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
	const barePath = stripLanguagePrefix(path);
	if (lang === "hu") return barePath;
	return `/en${barePath}`;
}

export function getHomeAnchor(anchor: string, currentPath: string): string {
	const barePath = stripLanguagePrefix(currentPath).split(/[?#]/)[0];
	return barePath === "/" ? `#${anchor}` : `${localizePath("/", getPathLanguage(currentPath))}#${anchor}`;
}
