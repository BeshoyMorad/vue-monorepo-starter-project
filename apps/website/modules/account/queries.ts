import { queryOptions } from '@tanstack/vue-query';
import { queryKeys } from '~/api/query-keys';
import type { AccountService } from './services';
import type { StatsDomain } from './types';

export const profileQueryOptions = (service: AccountService, enabled = true) =>
  queryOptions({
    enabled,
    queryKey: queryKeys.account.profile(),
    queryFn: ({ signal }) => service.profile(signal),
    staleTime: 60_000,
  });

export const statsQueryOptions = (service: AccountService, domain: StatsDomain) =>
  queryOptions({
    queryKey: queryKeys.account.stats(domain),
    queryFn: ({ signal }) => service.stats(domain, signal),
    staleTime: 5 * 60_000,
  });
