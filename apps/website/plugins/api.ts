import { createApiClient, setApiClient } from '@workspace/core/lib';
import getWebsiteConfig from '~/config';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const config = getWebsiteConfig();
  const authStore = useAuthStore();

  const api = createApiClient({
    baseURL: config.apiBaseUrl,
    getToken: () => authStore.token,
    onUnauthorized: async () => {
      await authStore.logout();
    },
  });

  setApiClient(api);
  nuxtApp.vueApp.provide('api', api);

  return {
    provide: {
      api,
    },
  };
});
