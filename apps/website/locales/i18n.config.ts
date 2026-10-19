import { defaultDatetimeFormats, defaultNumberFormats } from '@workspace/locales';

export default defineI18nConfig(() => ({
  legacy: false,
  datetimeFormats: defaultDatetimeFormats,
  numberFormats: defaultNumberFormats,
}));
