import hu from "./locales/hu.json" with { type: "json" };
import en from "./locales/en.json" with { type: "json" };

export const supportedLanguages = ["hu", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
export const fallbackLanguage: SupportedLanguage = "hu";

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<string, TranslationValue>;

const translations: Record<SupportedLanguage, Translations> = {
	hu: hu as Translations,
	en: en as Translations,
};

/**
 * Get a translation by key with optional interpolation
 * @param key - Dot-notation key (e.g., "hero.title")
 * @param lang - Language code
 * @param params - Optional interpolation params (e.g., { name: "John" })
 */
export function t(
	key: string,
	lang: SupportedLanguage,
	params?: Record<string, string | number> & { defaultValue?: string },
): string {
	const keys = key.split(".");
	let value: unknown = translations[lang];

	for (const k of keys) {
		if (value === undefined || value === null) {
			return params?.defaultValue ?? key;
		}
		value = (value as Record<string, unknown>)[k];
	}

	if (typeof value !== "string") {
		return params?.defaultValue ?? key;
	}

	// Handle interpolation like {{name}} or {{shown}}
	if (params) {
		return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
			if (paramKey === "defaultValue") return `{{${paramKey}}}`;
			return params[paramKey]?.toString() ?? `{{${paramKey}}}`;
		});
	}

	return value;
}

/**
 * Check if a string is a valid supported language
 */
export function isValidLanguage(lang: string): lang is SupportedLanguage {
	return supportedLanguages.includes(lang as SupportedLanguage);
}

/**
 * Get language from cookie header
 */
export function getLangFromCookie(req: Request): SupportedLanguage {
	const cookieHeader = req.headers.get("cookie") || "";
	const match = cookieHeader.match(/lang=(\w+)/);
	const lang = match?.[1];
	return lang && isValidLanguage(lang) ? lang : fallbackLanguage;
}

/**
 * Get language from Accept-Language header
 */
export function getLangFromHeader(req: Request): SupportedLanguage {
	const acceptLang = req.headers.get("accept-language") || "";
	for (const lang of supportedLanguages) {
		if (acceptLang.toLowerCase().includes(lang)) {
			return lang;
		}
	}
	return fallbackLanguage;
}

/**
 * Detect language from request (cookie first, then header)
 */
export function detectLanguage(req: Request): SupportedLanguage {
	// Try cookie first
	const cookieHeader = req.headers.get("cookie") || "";
	const match = cookieHeader.match(/lang=(\w+)/);
	const cookieLang = match?.[1];
	if (cookieLang && isValidLanguage(cookieLang)) {
		return cookieLang;
	}

	// Fall back to Accept-Language header
	return getLangFromHeader(req);
}
