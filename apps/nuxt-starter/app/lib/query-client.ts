import { QueryClient } from '@tanstack/vue-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute: data rendered on the server is not refetched on hydration
        retry: 3,
        refetchOnWindowFocus: true,
      },
    },
  });
}
