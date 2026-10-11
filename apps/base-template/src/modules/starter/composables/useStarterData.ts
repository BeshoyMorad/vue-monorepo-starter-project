import { useQuery } from '@tanstack/vue-query';
import { QUERY_KEYS } from '@workspace/core/lib/query-keys';
import { api, apiRoute } from '@/api';
import type { StarterProfile } from '@/modules/starter/types';

export function useStarterData() {
  return useQuery<StarterProfile>({
    queryKey: QUERY_KEYS.starter.profile(),
    queryFn: async () => {
      const response = await api.get<ApiResponse<StarterProfile>>(apiRoute('starter.profile'));
      return response.data;
    },
  });
}
