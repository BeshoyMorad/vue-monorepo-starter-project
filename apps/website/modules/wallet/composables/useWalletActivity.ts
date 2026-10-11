import { useQueries } from '@tanstack/vue-query';
import { completed, monthlyActivity, sumAmounts } from '~/modules/wallet/activity';
import { historyQueryOptions } from '~/modules/wallet/queries';
import { useWalletService } from '~/modules/wallet/services';

/** Largest page the history endpoint serves: the totals and chart read one page per kind */
export const ACTIVITY_LIMIT = 100;

/**
 * Deposits and withdrawals of the wallet, for the balance tiles, the withdrawal requests
 * and the analytics chart. There's no customer summary endpoint, so the numbers are worked
 * out from the latest {@link ACTIVITY_LIMIT} entries of each kind; `partial` says when there
 * are more than that.
 */
export function useWalletActivity(walletId: MaybeRefOrGetter<string | undefined>) {
  const service = useWalletService();
  const results = useQueries({
    queries: computed(() =>
      (['DEPOSIT', 'WITHDRAWAL'] as const).map((domain) =>
        historyQueryOptions(
          service,
          { domain, walletId: toValue(walletId), limit: ACTIVITY_LIMIT, page: 1 },
          Boolean(toValue(walletId))
        )
      )
    ),
  });

  const deposits = computed(() => results.value[0]?.data?.items ?? []);
  const withdrawals = computed(() => results.value[1]?.data?.items ?? []);
  const isPending = computed(() => results.value.some((result) => result.isPending));
  const partial = computed(() =>
    results.value.some((result) => (result.data?.meta.total ?? 0) > ACTIVITY_LIMIT)
  );

  const totals = computed(() => {
    const doneDeposits = completed(deposits.value);
    const doneWithdrawals = completed(withdrawals.value);
    return {
      totalDeposits: sumAmounts(doneDeposits),
      transferred: sumAmounts(doneWithdrawals),
      depositCount: doneDeposits.length,
      withdrawals: doneWithdrawals.length,
    };
  });
  const months = computed(() => monthlyActivity(deposits.value, withdrawals.value));
  const hasActivity = computed(() => deposits.value.length + withdrawals.value.length > 0);

  return { withdrawals, totals, months, hasActivity, partial, isPending };
}
