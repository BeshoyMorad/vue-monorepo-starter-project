import type * as yup from 'yup';
import type { Network } from '@/types/network';
import type { availableAssetsSchema } from '@/features/assets/schemas/available-assets.schema';
import type { customTokenSchema } from '@/features/assets/schemas/custom-token.schema';

// ----------------------------------------------------------------
// APIs
// ----------------------------------------------------------------
export type AssetType = 'COIN' | 'TOKEN' | 'CUSTOM_TOKEN' | 'ORDER';

export type AssetVaultStatus = 'active' | 'deactivated';

export type AssetStatus = 'ACTIVE' | 'PENDING' | 'HELD_BY_CORPORATE' | 'HELD_BY_SUPER_ADMIN';

export interface Asset {
  id: number;
  name: string;
  symbol: string;
  contractAddress: string | null;
  network: Network;
  logo: string;
  decimals: number;
}

export interface AssetVault extends Asset {
  status: AssetStatus;
  vaultStatus: AssetVaultStatus;
  isHidden: boolean;
  type: AssetType;
}

// ----------------------------------------------------------------

// ----------------------------------------------------------------
// Forms
// ----------------------------------------------------------------
export interface AssetFilter {
  networkId?: number;
  status?: AssetStatus;
}

export interface CreateCustomTokenPayload {
  name: string;
  symbol: string;
  contractAddress: string;
  decimals: number;
  networkId: number;
  mediaIdsToAdd?: string[];
}

export interface AddAvailableAssetsPayload {
  assetsIds: number[];
  totalAssetsCount: number;
}
// ----------------------------------------------------------------

export type CustomTokenFormValues = yup.InferType<typeof customTokenSchema>;

export type AvailableAssetsFormValues = yup.InferType<typeof availableAssetsSchema>;
