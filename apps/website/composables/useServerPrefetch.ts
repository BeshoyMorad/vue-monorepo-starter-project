import { onServerPrefetch } from 'vue';

/**
 * Makes a TanStack query render with data during SSR/SSG/ISR instead of a loading state.
 * The result is dehydrated into the page and reused by the browser (no second request).
 *
 * Usage: const { data } = useServerPrefetch(useQuery(productQueryOptions(api, id)));
 */
export function useServerPrefetch<TQuery extends { suspense: () => Promise<unknown> }>(
  query: TQuery
): TQuery {
  onServerPrefetch(async () => {
    await query.suspense();
  });
  return query;
}
