import { QueryClient, type QueryClientConfig } from '@tanstack/vue-query';

/**
 * Creates a QueryClient instance with shared base defaults:
 * - staleTime: 60s
 * - retry: 2
 * - refetchOnWindowFocus: enabled on client, disabled in SSR
 *
 * Consumer applications can extend or override defaults with `config`.
 */
export function createBaseQueryClient(config?: QueryClientConfig): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        retry: 2,
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
