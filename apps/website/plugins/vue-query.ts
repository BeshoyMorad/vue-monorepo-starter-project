import {
  VueQueryPlugin,
  dehydrate,
  hydrate,
  type DehydratedState,
  type QueryClient,
} from '@tanstack/vue-query';
import { createBaseQueryClient } from '@workspace/core/lib/query-client';
import { getApiErrorStatus } from '~/utils/apiError';

const MAX_QUERY_RETRIES = 2;

/**
 * Retry only failures that can succeed on a second try (network, 5xx).
 * Client errors (4xx) will fail again. The server never retries, so SSR stays fast.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (import.meta.server) {
    return false;
  }
  const status = getApiErrorStatus(error);
  if (status && status >= 400 && status < 500) {
    return false;
  }
  return failureCount < MAX_QUERY_RETRIES;
}

export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query', () => null);

  // Initialize QueryClient per request to avoid cross-request data leaks on server
  const queryClient: QueryClient = createBaseQueryClient();

  const defaults = queryClient.getDefaultOptions();
  queryClient.setDefaultOptions({
    ...defaults,
    queries: {
      ...defaults.queries,
      retry: shouldRetry,
    },
    mutations: {
      ...defaults.mutations,
      // Mutations are not idempotent: never retry them automatically
      retry: false,
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  if (import.meta.server) {
    nuxtApp.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    if (vueQueryState.value) {
      hydrate(queryClient, vueQueryState.value);
    }
  }

  // Typed in types/nuxt.d.ts. Provided imperatively (not returned) to avoid circular plugin types.
  nuxtApp.provide('queryClient', queryClient);
});
