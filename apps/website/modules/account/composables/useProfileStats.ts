import { useQueries, useQueryClient } from '@tanstack/vue-query';
import { queryKeys } from '~/api/query-keys';
import { statsQueryOptions } from '~/modules/account/queries';
import { useAccountService } from '~/modules/account/services';
import { STATS_DOMAINS, type StatsDomain } from '~/modules/account/types';

/** Statistics of every domain (for the tab counts) and the selected one (for the details) */
export function useProfileStats() {
  const service = useAccountService();
  const queryClient = useQueryClient();
  const results = useQueries({
    queries: STATS_DOMAINS.map((domain) => statsQueryOptions(service, domain)),
  });

  const selected = ref<StatsDomain>('marketplace');
  const byDomain = computed(() =>
    Object.fromEntries(STATS_DOMAINS.map((domain, index) => [domain, results.value[index]]))
  );
  const current = computed(() => byDomain.value[selected.value]);
  const isRefreshing = computed(() => results.value.some((result) => result.isFetching));
  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.account.all() });

  return { domains: STATS_DOMAINS, selected, byDomain, current, isRefreshing, refresh };
}
