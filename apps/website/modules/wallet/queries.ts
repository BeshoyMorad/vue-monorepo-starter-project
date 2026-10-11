import { keepPreviousData, queryOptions } from '@tanstack/vue-query';
import { queryKeys } from '~/api/query-keys';
import type { WalletService } from './services';
import type { WalletHistoryParams } from './types';

export const walletQueryOptions = (service: WalletService, enabled = true) =>
  queryOptions({
    enabled,
    queryKey: queryKeys.wallet.current(),
    queryFn: ({ signal }) => service.current(signal),
    staleTime: 30_000,
  });

/** Keeps the previous page on screen while the next page or filter loads */
export const historyQueryOptions = (
  service: WalletService,
  params: WalletHistoryParams,
  enabled = true
) =>
  queryOptions({
    enabled,
    queryKey: queryKeys.wallet.history(params),
    queryFn: ({ signal }) => service.history(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
