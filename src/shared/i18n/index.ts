/**
 * Shared - i18n
 * 
 * Internationalization setup with i18next
 * - Auto-detects user's device language
 * - Falls back to default if language not supported
 * - Syncs with Zustand store
 */

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'expo-localization';
import en from './locales/en.json';
import tr from './locales/tr.json';

/**
 * Supported languages
 * Add new languages here
 */
export const SUPPORTED_LANGUAGES = ['en', 'tr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Default language (fallback)
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * Language resources
 */
const resources = {
  en: {translation: en},
  tr: {translation: tr},
};

/**
 * Detect user's device language
 * Returns supported language or default
 */
export function detectDeviceLanguage(): SupportedLanguage {
  try {
    const locales = getLocales();
    const deviceLanguage = locales[0]?.languageCode;

    // Check if device language is supported
    if (deviceLanguage && SUPPORTED_LANGUAGES.includes(deviceLanguage as any)) {
      return deviceLanguage as SupportedLanguage;
    }

    // Fallback to default
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('[i18n] Error detecting device language:', error);
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Initialize i18n
 */
i18n.use(initReactI18next).init({
  resources,
  lng: detectDeviceLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

/**
 * Change language at runtime
 */
export function changeLanguage(language: SupportedLanguage) {
  i18n.changeLanguage(language);
}

/**
 * Get current language
 */
export function getCurrentLanguage(): SupportedLanguage {
  return i18n.language as SupportedLanguage;
}

export default i18n;
