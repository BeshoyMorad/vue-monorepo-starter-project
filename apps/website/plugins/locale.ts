import type { Ref } from 'vue';
import {
  syncDocumentLocale,
  syncDayjsLocale,
  SUPPORTED_LOCALES,
  type LocaleCode,
} from '@workspace/locales';

/**
 * Global SSR & Hydration Locale Plugin for Nuxt 3.
 * Reactively sets <html lang="..." dir="..."> on the initial SSR response
 * and keeps Dayjs & DOM attributes synchronized on client route/locale updates.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as { locale: Ref<string> };

  // 1. Reactive SSR & Head attributes (dir & lang)
  useHead(() => {
    const current = (i18n.locale.value || 'en') as LocaleCode;
    const direction = SUPPORTED_LOCALES[current]?.direction ?? 'ltr';
    return {
      htmlAttrs: {
        lang: current,
        dir: direction,
      },
    };
  });

  // 2. Client-side listener to sync Dayjs & DOM when locale changes
  if (import.meta.client) {
    watch(
      () => i18n.locale.value as LocaleCode,
      async (newLocale) => {
        syncDocumentLocale(newLocale);
        await syncDayjsLocale(newLocale);
      },
      { immediate: true }
    );
  }
});
