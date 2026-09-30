import { ofetch, type $Fetch } from 'ofetch';
import { notify as showToast } from '@workspace/core/utils/toast';
import getWebsiteConfig from '~/config';
import { REDIRECT_QUERY_KEY } from '~/constants/auth';
import { paths } from '~/router/paths';
import { useAuthStore } from '~/stores/auth';
import { getRouteLocale } from '~/utils/locale';
import {
  createRequestErrorHook,
  createRequestHook,
  createResponseErrorHook,
  type InterceptorContext,
} from './interceptors';

/** The HTTP transport TanStack Query calls in its queryFn / mutationFn. */
export type ApiFetch = $Fetch;

/**
 * Builds the website fetch client for one Nuxt app instance (one per request on the
 * server, one in the browser), so tokens never leak between SSR requests.
 * Must be called inside the Nuxt context (a plugin).
 */
export function createWebsiteApi(): ApiFetch {
  const nuxtApp = useNuxtApp();
  const config = getWebsiteConfig();
  const authStore = useAuthStore();
  const i18n = nuxtApp.$i18n;

  const ctx: InterceptorContext = {
    getToken: () => authStore.token,
    getLocale: () => i18n.locale.value,
    t: (key) => i18n.t(key),
    notify: (message) => {
      if (import.meta.client) {
        showToast('error', { title: i18n.t('errors.title'), body: message });
      }
    },
    onSessionExpired: () =>
      nuxtApp.runWithContext(async () => {
        authStore.clearSession();
        nuxtApp.$queryClient?.clear();

        const route = useRoute();
        const loginPath = useLocalePath()(paths.auth.login, getRouteLocale(route));
        if (route.path === loginPath) {
          return;
        }

        await navigateTo({ path: loginPath, query: { [REDIRECT_QUERY_KEY]: route.fullPath } });
      }),
  };

  return ofetch.create({
    baseURL: config.apiBaseUrl,
    timeout: 15000,
    // TanStack Query owns retries; retrying here too would multiply requests
    retry: 0,
    onRequest: createRequestHook(ctx),
    onRequestError: createRequestErrorHook(ctx),
    onResponseError: createResponseErrorHook(ctx),
  });
}
