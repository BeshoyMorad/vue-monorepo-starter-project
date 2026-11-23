import { createApiClient, setApiClient } from '@workspace/core/lib';
import getWebsiteConfig from '~/config';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const config = getWebsiteConfig();
  const authStore = useAuthStore();

  const api = createApiClient({
    baseURL: config.apiBaseUrl,
    getToken: () => authStore.token,
    onUnauthorized: async (error) => {
      const sentToken = new Headers(error.options?.headers).get('Authorization');
      if (authStore.token && sentToken === `Bearer ${authStore.token}`) {
        await authStore.logout();
      }
    },
  });

  if (import.meta.client) setApiClient(api);
  nuxtApp.vueApp.provide('api', api);

  return {
    provide: {
      api,
    },
  };
});
