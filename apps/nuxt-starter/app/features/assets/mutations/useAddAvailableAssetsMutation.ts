import type { AddAvailableAssetsPayload } from '@/features/assets/types';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { assetsServices } from '@/features/assets/services';
import { success as successToast, error as errorToast } from '@/utils/toast';
import { getApiErrorMessage } from '@/utils/apiError';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { ApiResponse } from '@/types/api';

interface AddAvailableAssetsVariables {
  payload: AddAvailableAssetsPayload;
  networkId?: number;
}

export const useAddAvailableAssetsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<unknown>, unknown, AddAvailableAssetsVariables>({
    mutationFn: async ({ payload, networkId }) => {
      return await assetsServices.addAvailableAssets(payload, networkId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assets.list() });
      successToast(data.message || 'Assets added successfully');
    },
    onError: (err: unknown) => {
      const message = getApiErrorMessage(err, 'Failed to add assets');
      errorToast(message);
    },
  });
};
