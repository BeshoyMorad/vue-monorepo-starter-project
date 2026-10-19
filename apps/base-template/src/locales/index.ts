import { createI18n } from 'vue-i18n';
import {
  FALLBACK_LOCALE,
  getStoredLocale,
  defaultDatetimeFormats,
  defaultNumberFormats,
  type LocaleCode,
} from '@workspace/locales';
import enMessages from './en';

export const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  messages: {
    en: enMessages as never,
  },
  datetimeFormats: defaultDatetimeFormats as never,
  numberFormats: defaultNumberFormats as never,
});

export async function loadLocaleMessages(locale: LocaleCode): Promise<void> {
  if (i18n.global.availableLocales.includes(locale)) {
    return;
  }

  if (locale === 'ar') {
    const messages = await import('./ar');
    i18n.global.setLocaleMessage('ar', messages.default as never);
  }
}

export default i18n;
