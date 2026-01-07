import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json" with { type: "json" };
import hu from "./locales/hu.json" with { type: "json" };

export const supportedLanguages = ["hu", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
export const fallbackLanguage: SupportedLanguage = "hu";

const resources = {
	en: { translation: en },
	hu: { translation: hu },
};

export function createI18nInstance(lang: SupportedLanguage): i18n {
	const instance = i18next.createInstance();
	instance.use(initReactI18next).init({
		resources,
		lng: lang,
		fallbackLng: fallbackLanguage,
		interpolation: {
			escapeValue: false,
		},
	});
	return instance;
}

export function isValidLanguage(lang: string): lang is SupportedLanguage {
	return supportedLanguages.includes(lang as SupportedLanguage);
}
