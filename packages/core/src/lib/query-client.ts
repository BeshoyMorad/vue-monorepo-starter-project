import { QueryClient, type QueryClientConfig } from '@tanstack/vue-query';

/**
 * Creates a QueryClient instance with shared base defaults:
 * - staleTime: 60s
 * - retry: smart retry (disabled in SSR, skips 4xx errors, max 2 retries for recoverable network errors on client)
 * - refetchOnWindowFocus: enabled on client, disabled in SSR
 *
 * Consumer applications can extend or override defaults with `config`.
 */
export function createBaseQueryClient(config?: QueryClientConfig): QueryClient {
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
        ...config?.defaultOptions?.queries,
      },
      mutations: {
        ...config?.defaultOptions?.mutations,
      },
    },
    ...config,
  });
}

export const queryClient = createBaseQueryClient();
