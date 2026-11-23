import { useQuery } from '@tanstack/vue-query';
import { queryKeys } from '@/api/query-keys';
import { api, apiRoute } from '@/api';
import type { StarterProfile } from '@/modules/starter/types';

export function useStarterData() {
  return useQuery<StarterProfile>({
    queryKey: queryKeys.starter.profile.queryKey,
    queryFn: async () => {
      const response = await api.get<ApiResponse<StarterProfile>>(apiRoute('starter.profile'));
      return response.data;
    },
  });
}
