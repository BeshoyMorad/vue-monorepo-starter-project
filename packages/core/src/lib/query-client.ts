import { QueryClient, hashKey, type QueryClientConfig } from '@tanstack/vue-query';

type LocaleResolver = () => string;

let localeResolver: LocaleResolver | undefined;

/**
 * Registers how the shared `queryClient` reads the active locale.
 * Per-request clients (SSR) should pass `getLocale` to `createBaseQueryClient` instead.
 */
export function setQueryClientLocale(resolver: LocaleResolver): void {
  localeResolver = resolver;
}

/**
 * Creates a QueryClient instance with shared base defaults:
 * - staleTime: 60s
 * - retry: smart retry (disabled in SSR, skips 4xx errors, max 2 retries for recoverable network errors on client)
 * - refetchOnWindowFocus: enabled on client, disabled in SSR
 *
 * - queryKeyHashFn: hashes the active locale into every query so each language keeps its own
 *   cache entry. Switching back to a fetched locale reuses that response instead of refetching.
 *   Skipped when no locale is available. Do not add locale to individual query keys.
 *
 * Consumer applications can extend or override defaults with `config`.
 */
export function createBaseQueryClient(
  config?: QueryClientConfig,
  getLocale: LocaleResolver = () => localeResolver?.() ?? ''
): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        retry: (failureCount, error: unknown) => {
          // Never retry on server to prevent delaying SSR response
          if (typeof window === 'undefined') {
            return false;
          }

          // Do not retry 4xx client errors (e.g. 404 Not Found, 401 Unauthorized, 403 Forbidden)
          const err = error as { status?: number };
          const status = err?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }

          return failureCount < 1;
        },
        refetchOnWindowFocus: typeof window !== 'undefined',
        queryKeyHashFn: (queryKey) => {
          const locale = getLocale();
          return hashKey(locale ? [locale, ...queryKey] : queryKey);
        },
        ...config?.defaultOptions?.queries,
      },
      mutations: {
        ...config?.defaultOptions?.mutations,
        retry: false,
      },
    },
    ...config,
  });
}

export const queryClient = createBaseQueryClient();
