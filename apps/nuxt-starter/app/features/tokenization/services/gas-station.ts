import { api } from '@/lib/api/client';
import { apiRoute } from '@/lib/api/endpoints';
import type { GasStationWallet } from '@/features/tokenization/types';
import type { ApiResponse } from '@/types/api';

export const gasStationService = {
  /** Gas station wallets for a category on one network, including their balance. */
  getWallets: async (params: { targetId: number; networkId: number }) => {
    const { data } = await api.get<ApiResponse<GasStationWallet[]>>(
      apiRoute('gas-station.wallets'),
      { params }
    );
    return data;
  },
};
