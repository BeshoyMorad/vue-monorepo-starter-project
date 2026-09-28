import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { queryClient } from '@workspace/core/lib/query-client';
import { validateEnv } from '@workspace/core/env';
import './css/index.css';
import router from './router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import App from './App.vue';
import { error as toastError } from '@workspace/core/utils/toast';

import i18n, { loadLocaleMessages } from './locales';
import { registerAppI18n, useAppLocale } from '@workspace/core/composables';

// Fail fast if required environment variables are missing
validateEnv(import.meta.env);

registerAppI18n(i18n, loadLocaleMessages);

dayjs.extend(duration);
dayjs.extend(relativeTime);

const app = createApp(App);

app.config.errorHandler = (err, _instance, info) => {
  // eslint-disable-next-line no-console
  console.error('[Global Vue Error]:', err, info);
  toastError('An unexpected component error occurred.');
};

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const { initLocale } = useAppLocale();
void initLocale();

app.use(pinia).use(i18n).use(VueQueryPlugin, { queryClient }).use(router).mount('#app');
