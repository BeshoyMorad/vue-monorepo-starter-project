import { createI18n, type I18n } from 'vue-i18n';
import type { ObjectPlugin } from 'vue';
import { DEFAULT_LOCALE, FALLBACK_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from './config';
import { defaultDatetimeFormats, defaultNumberFormats } from './formats';

export type NumberFormatsSchema = typeof defaultNumberFormats;
export type DatetimeFormatsSchema = typeof defaultDatetimeFormats;

export interface CreateAppI18nOptions<Messages extends Record<string, unknown>> {
  defaultLocale?: LocaleCode;
  fallbackLocale?: LocaleCode;
  defaultMessages: Messages;
  loaders: Record<LocaleCode, () => Promise<{ default: Messages }>>;
  numberFormats?: NumberFormatsSchema;
  datetimeFormats?: DatetimeFormatsSchema;
}

export interface AppI18nResult {
  i18n: I18n & ObjectPlugin;
  loadLocaleMessages: (locale: LocaleCode) => Promise<void>;
  numberFormats: NumberFormatsSchema;
  datetimeFormats: DatetimeFormatsSchema;
}

export function createAppI18n<Messages extends Record<string, unknown>>(
  options: CreateAppI18nOptions<Messages>
): AppI18nResult {
  const {
    defaultLocale = DEFAULT_LOCALE,
    fallbackLocale = FALLBACK_LOCALE,
    defaultMessages,
    loaders,
    numberFormats = defaultNumberFormats,
    datetimeFormats = defaultDatetimeFormats,
  } = options;

  const i18n = createI18n<false>({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale,
    messages: {
      [defaultLocale]: defaultMessages as never,
    } as never,
    datetimeFormats: datetimeFormats as never,
    numberFormats: numberFormats as never,
  });

  async function loadLocaleMessages(locale: LocaleCode): Promise<void> {
    if (!SUPPORTED_LOCALES[locale]) {
      // eslint-disable-next-line no-console
      console.warn(`[i18n]: Locale "${locale}" is not supported.`);
      return;
    }

    if (i18n.global.availableLocales.includes(locale)) {
      return;
    }

    const loader = loaders[locale];
    if (!loader) {
      // eslint-disable-next-line no-console
      console.warn(`[i18n]: No loader found for locale "${locale}".`);
      return;
    }

    try {
      const messages = await loader();
      i18n.global.setLocaleMessage(locale, messages.default as never);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[i18n]: Failed to load locale messages chunk for "${locale}":`, error);
      throw error;
    }
  }

  return {
    i18n,
    loadLocaleMessages,
    numberFormats: defaultNumberFormats,
    datetimeFormats: defaultDatetimeFormats,
  };
}
