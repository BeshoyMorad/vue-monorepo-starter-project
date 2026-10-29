import { setupYupLocale, type YupTranslator } from '@workspace/core/lib/yup';

/** Points Yup's built-in messages at @nuxtjs/i18n; messages come from the shared `yup` namespace. */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as unknown as { t: YupTranslator };

  setupYupLocale(i18n.t);
});
