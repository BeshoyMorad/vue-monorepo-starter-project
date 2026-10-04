import { api } from '@/lib/api/client';
import { apiRoute } from '@/lib/api/endpoints';
import type { MasterWallet } from '@/features/tokenization/types';
import type { ApiResponse } from '@/types/api';

export const vaultsServices = {
  /** Master wallets of a vault, filtered by network. */
  getMasterWallets: async (vaultId: number, params: { networkId: number; targetId: number }) => {
    const { data } = await api.get<ApiResponse<MasterWallet[]>>(
      apiRoute('vaults.master-wallets', { id: vaultId }),
      { params }
    );
    return data;
  },
};
