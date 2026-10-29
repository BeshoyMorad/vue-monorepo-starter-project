import { createI18n } from 'vue-i18n';
import {
  FALLBACK_LOCALE,
  getStoredLocale,
  defaultDatetimeFormats,
  defaultNumberFormats,
  type LocaleCode,
} from '@workspace/locales';
import { loadLocaleFileMessages } from './messages';

const initialLocale = getStoredLocale();

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: FALLBACK_LOCALE,
  messages: {},
  datetimeFormats: defaultDatetimeFormats as never,
  numberFormats: defaultNumberFormats as never,
});

/**
 * Loads a locale message chunk on demand. The active locale is loaded at bootstrap.
 */
export async function loadLocaleMessages(locale: LocaleCode): Promise<void> {
  if (i18n.global.availableLocales.includes(locale)) {
    return;
  }

  const messages = await loadLocaleFileMessages(locale);
  i18n.global.setLocaleMessage(locale, messages as never);
}

/** Loads the stored locale, browser language, or site default. */
export async function bootstrapI18n(): Promise<void> {
  await loadLocaleMessages(initialLocale);
}

export default i18n;
