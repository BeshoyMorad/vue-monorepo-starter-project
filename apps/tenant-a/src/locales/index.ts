import { createAppI18n } from '@workspace/locales';
import enMessages from './en';

export const { i18n, loadLocaleMessages, numberFormats, datetimeFormats } = createAppI18n({
  defaultMessages: enMessages,
  loaders: {
    en: () => Promise.resolve({ default: enMessages }),
    ar: () => import('./ar'),
  },
});

export default i18n;
