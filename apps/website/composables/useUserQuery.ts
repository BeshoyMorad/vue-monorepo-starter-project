import { computed, toValue, type Ref } from 'vue';
import { useQuery, queryOptions } from '@tanstack/vue-query';
import { useApi } from '~/composables/useApi';
import { apiRoute } from '~/api/endpoints';
import { queryKeys } from '~/api/query-keys';
import type { ApiFetch } from '~/api/client';

export interface UserItem {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  status?: string;
}

/**
 * Nuxt 3 user query options for SSR prefetching & client hydration.
 */
export const userQueryOptions = (api: ApiFetch, id: string | number) =>
  queryOptions({
    queryKey: queryKeys.users.details(id),
    queryFn: ({ signal }): Promise<UserItem> =>
      api<UserItem>(apiRoute('users.detail', { id }), { signal }),
    staleTime: 1000 * 60,
  });

/**
 * Composable for querying user data in Nuxt 3 components.
 */
export function useUserQuery(id: Ref<string | number> | string | number) {
  const api = useApi();
  const queryOpts = computed(() => userQueryOptions(api, toValue(id)));
  return useQuery(queryOpts);
}
