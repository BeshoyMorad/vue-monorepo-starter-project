import { ofetch, type FetchOptions } from 'ofetch';
import { notify as showToast } from '@workspace/core/utils/toast';
import getWebsiteConfig from '~/config';
import { REDIRECT_QUERY_KEY } from '~/constants/auth';
import { paths } from '~/router/paths';
import { useAuthStore } from '~/stores/auth';
import type { ApiEnvelope } from '~/types/api';
import type { AuthTokens } from '~/types/auth';
import { getApiErrorStatus } from '~/utils/apiError';
import { getRouteLocale } from '~/utils/locale';
import { apiRoute } from './endpoints';
import {
  createRequestErrorHook,
  createRequestHook,
  createResponseErrorHook,
  type InterceptorContext,
} from './interceptors';

export type ApiFetchOptions = FetchOptions<'json'>;

/** The HTTP transport TanStack Query calls in its queryFn / mutationFn. */
export type ApiFetch = <T = unknown>(request: string, options?: ApiFetchOptions) => Promise<T>;

type RawFetch = ReturnType<typeof ofetch.create>;

/**
 * Token refresh and session expiry, each deduplicated so parallel requests share one call.
 * Must be called inside the Nuxt context.
 */
function createSessionHandlers(raw: RawFetch) {
  const nuxtApp = useNuxtApp();
  const authStore = useAuthStore();

  let refreshing: Promise<boolean> | null = null;
  let expiring: Promise<void> | null = null;

  /** Exchanges the refresh token for new tokens. Resolves false when that's not possible. */
  const refreshSession = () =>
    (refreshing ??= (async () => {
      const refreshToken = authStore.refreshToken;
      if (!refreshToken) {
        return false;
      }
      try {
        const response = await raw<ApiEnvelope<AuthTokens>>(apiRoute('auth.refresh-token'), {
          method: 'POST',
          body: { refreshToken },
          skipAuth: true,
          silent: true,
        });
        nuxtApp.runWithContext(() => authStore.setTokens(response.data));
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshing = null;
    }));

  /** Clears the session and sends the user to login, keeping the current page to return to. */
  const expireSession = () =>
    (expiring ??= nuxtApp
      .runWithContext(async () => {
        authStore.clearSession();
        nuxtApp.$queryClient?.clear();

        const route = useRoute();
        const loginPath = useLocalePath()(paths.auth.login, getRouteLocale(route));
        if (route.path !== loginPath) {
          await navigateTo({ path: loginPath, query: { [REDIRECT_QUERY_KEY]: route.fullPath } });
        }
      })
      .finally(() => {
        expiring = null;
      }));

  return { refreshSession, expireSession };
}

/**
 * Builds the website fetch client for one Nuxt app instance (one per request on the
 * server, one in the browser), so tokens never leak between SSR requests.
 * Must be called inside the Nuxt context (a plugin).
 *
 * Session handling:
 * - an access token that is about to expire is refreshed before the request is sent
 * - a 401 on a request that carried a token triggers one refresh + retry
 * - if the refresh fails, the session is cleared and the user is sent to login
 * Parallel requests share a single refresh call.
 */
export function createWebsiteApi(): ApiFetch {
  const nuxtApp = useNuxtApp();
  const config = getWebsiteConfig();
  const authStore = useAuthStore();
  const i18n = nuxtApp.$i18n;

  const ctx: InterceptorContext = {
    getToken: () => authStore.accessToken,
    getLocale: () => i18n.locale.value,
    t: (key) => i18n.t(key),
    te: (key) => i18n.te(key),
    notify: (message) => {
      if (import.meta.client) {
        showToast('error', { title: i18n.t('errors.title'), body: message });
      }
    },
  };

  const raw = ofetch.create({
    baseURL: config.apiBaseUrl,
    timeout: 15000,
    // TanStack Query owns retries; retrying here too would multiply requests
    retry: 0,
    onRequest: createRequestHook(ctx),
    onRequestError: createRequestErrorHook(ctx),
    onResponseError: createResponseErrorHook(ctx),
  });

  const { refreshSession, expireSession } = createSessionHandlers(raw);

  return async <T>(request: string, options: ApiFetchOptions = {}): Promise<T> => {
    const usesSession = !options.skipAuth && authStore.isAuthenticated;

    if (usesSession && authStore.isAccessTokenExpired() && !(await refreshSession())) {
      await expireSession();
    }

    const sentToken = !options.skipAuth && authStore.isAuthenticated;
    try {
      return (await raw<T>(request, options)) as T;
    } catch (error) {
      if (getApiErrorStatus(error) !== 401 || !sentToken || options.skipAuthRedirect) {
        throw error;
      }
      if (await refreshSession()) {
        return (await raw<T>(request, options)) as T;
      }
      await expireSession();
      throw error;
    }
  };
}
