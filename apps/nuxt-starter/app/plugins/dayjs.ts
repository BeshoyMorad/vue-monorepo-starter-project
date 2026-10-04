import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SUPPORTED_LOCALES } from '@/constants/locales';

const dayjsLocaleLoaders: Record<string, () => Promise<unknown>> = {
  en: () => import('dayjs/locale/en'),
  ar: () => import('dayjs/locale/ar'),
};

async function syncDayjsLocale(dayjsLocale: string): Promise<void> {
  try {
    await dayjsLocaleLoaders[dayjsLocale]?.();
    dayjs.locale(dayjsLocale);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[dayjs]: Failed to load locale "${dayjsLocale}":`, err);
  }
}

/** Registers dayjs plugins and keeps the dayjs locale in sync with the i18n locale. */
export default defineNuxtPlugin({
  name: 'dayjs',
  setup(nuxtApp) {
    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    watch(
      nuxtApp.$i18n.locale,
      (locale) => {
        if (isLocaleCode(locale)) void syncDayjsLocale(SUPPORTED_LOCALES[locale].dayjsLocale);
      },
      { immediate: true }
    );
  },
});
