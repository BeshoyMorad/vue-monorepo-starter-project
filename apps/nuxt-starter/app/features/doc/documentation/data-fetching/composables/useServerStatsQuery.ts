import { useQuery } from '@tanstack/vue-query';
import { QUERY_KEYS } from '@/lib/query-keys';

export const SERVER_STATS_REFETCH_INTERVAL = 5000;

/**
 * TanStack Query example for live, interactive data.
 *
 * - Polls every 5 seconds while the tab is visible and refetches when the window regains focus.
 * - The result is cached under its query key, so every component that calls this composable
 *   shares one request and one cache entry.
 * - `staleTime` matches the polling interval, so data hydrated from the server is used as is
 *   instead of being refetched as soon as the page mounts.
 *
 * It calls a demo Nitro route with `$fetch`. Real features call the backend through the
 * shared Axios client (`api` from `@/lib/api/client`), as `useStarterData` does.
 */
export function useServerStatsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.examples.serverStats(),
    queryFn: () => $fetch('/api/examples/server-stats'),
    refetchInterval: SERVER_STATS_REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: SERVER_STATS_REFETCH_INTERVAL,
  });
}
