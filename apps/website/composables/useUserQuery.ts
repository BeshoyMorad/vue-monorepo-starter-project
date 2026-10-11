import { computed, toValue, type Ref } from 'vue';
import { useQuery, queryOptions } from '@tanstack/vue-query';
import { useApi } from '~/composables/useApi';
import { apiRoute } from '~/api/endpoints';
import type { ApiClient } from '@workspace/core/lib';

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
export const userQueryOptions = (api: ApiClient, id: string | number) =>
  queryOptions({
    queryKey: ['users', 'details', id],
    queryFn: async (): Promise<UserItem> => {
      return await api.get<UserItem>(apiRoute('users.detail', { id }));
    },
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
