import { useQueryClient } from '@tanstack/vue-query';
import { onServerPrefetch } from 'vue';
import { allowOnServer, isServerFetchBlocked } from '~/utils/serverQueryGate';

/**
 * Opts a query into server rendering: the page arrives with its data instead of a loading
 * state, and the browser reuses the result (no second request).
 * Every other query runs only in the browser (see utils/serverQueryGate.ts), so use this
 * only for data that matters for first paint or SEO.
 *
 * Usage: const { data } = useServerPrefetch(() => useQuery(productQueryOptions(api, id)));
 *
 * Debugging: in `nuxt dev`, server calls are logged to the terminal as `[api:ssr] ...`.
 * To see them in the browser Network tab instead, set NUXT_PUBLIC_DEBUG_CLIENT_FETCH=true
 * in .env and restart dev.
 */
export function useServerPrefetch<TQuery extends { suspense: () => Promise<unknown> }>(
  create: () => TQuery
): TQuery {
  const client = useQueryClient();
  const query = allowOnServer(client, create);
  if (import.meta.server && !isServerFetchBlocked(client)) {
    onServerPrefetch(async () => {
      await query.suspense();
    });
  }
  return query;
}
