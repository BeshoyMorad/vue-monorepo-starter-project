import { useQuery } from '@tanstack/vue-query';
import { QUERY_KEYS } from '@/lib/query-keys';
import { api } from '@/lib/api/client';
import { apiRoute } from '@/lib/api/endpoints';
import type { StarterProfile } from '@/features/starter/types';
import type { ApiResponse } from '@/types/api';

export function useStarterData() {
  return useQuery<StarterProfile>({
    queryKey: QUERY_KEYS.starter.profile(),
    queryFn: async () => {
      const response = await api.get<ApiResponse<StarterProfile>>(apiRoute('starter.profile'));
      return response.data.data;
    },
  });
}
