import { queryOptions } from '@tanstack/vue-query';
import { queryKeys } from '~/api/query-keys';
import type { HomeService } from './services';

/** Platform totals; they change slowly, so a few minutes of caching is fine */
export const platformStatsQueryOptions = (service: HomeService) =>
  queryOptions({
    queryKey: queryKeys.stats.platform(),
    queryFn: ({ signal }) => service.platformStats(signal),
    staleTime: 5 * 60_000,
  });
