import type { ApiFetch } from '~/api/client';
import { apiRoute } from '~/api/endpoints';
import type { ApiEnvelope } from '~/types/api';
import type {
  ChangePinRequest,
  Wallet,
  WalletHistoryPage,
  WalletHistoryParams,
  WalletPageMeta,
  WalletTransaction,
} from './types';

/** History as the API sends it: the docs show { data, meta }, other lists use { items, meta } */
interface RawHistory {
  items?: WalletTransaction[];
  data?: WalletTransaction[];
  meta?: WalletPageMeta;
}

const EMPTY_META: WalletPageMeta = {
  page: 1,
  limit: 0,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

/** Drops empty filters, so the URL only carries what's set */
const compact = (params: object) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
  );

/**
 * The signed-in customer's wallet. Every call returns the envelope's `data`; failures throw
 * a FetchError. Calls are `silent`: the wallet page shows errors inline.
 */
export function createWalletService(api: ApiFetch) {
  return {
    current: async (signal?: AbortSignal) =>
      (await api<ApiEnvelope<Wallet>>(apiRoute('wallet.current'), { signal, silent: true })).data,

    history: async (
      params: WalletHistoryParams,
      signal?: AbortSignal
    ): Promise<WalletHistoryPage> => {
      const raw = (
        await api<ApiEnvelope<RawHistory | WalletTransaction[]>>(apiRoute('wallet.history'), {
          query: compact(params),
          signal,
          silent: true,
        })
      ).data;
      if (Array.isArray(raw)) {
        return { items: raw, meta: { ...EMPTY_META, total: raw.length, limit: raw.length } };
      }
      const items = raw?.items ?? raw?.data ?? [];
      return { items, meta: raw?.meta ?? { ...EMPTY_META, total: items.length } };
    },

    /** Test gateway: the amount is in riyals (major units), 0.01 to 1,000,000,000 */
    deposit: async (walletId: string, amount: number) =>
      (
        await api<ApiEnvelope<unknown>>(apiRoute('wallet.deposit', { walletId }), {
          method: 'POST',
          body: { amount },
          silent: true,
        })
      ).data,

    changePin: async (body: ChangePinRequest) =>
      (
        await api<ApiEnvelope<Wallet>>(apiRoute('wallet.pin'), {
          method: 'PUT',
          body,
          silent: true,
        })
      ).data,
  };
}

export type WalletService = ReturnType<typeof createWalletService>;

/** Wallet service bound to the app's fetch client. */
export const useWalletService = (): WalletService => createWalletService(useApi());
