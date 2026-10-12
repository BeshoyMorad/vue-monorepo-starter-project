import { PAYMENT_METHODS, TRANSACTION_STATUSES, type PaymentMethod } from '~/modules/wallet/types';

/** Choices of the history's payment-method and status filters, "all" first */
export function useHistoryFilterOptions() {
  const { t } = useI18n();
  const METHOD_ICONS: Record<PaymentMethod, string> = {
    WALLET: 'hugeicons--wallet-01',
    CARD: 'hugeicons--credit-card',
    BANK_TRANSFER: 'hugeicons--bank',
  };
  const methodOptions = computed(() => [
    { value: '' as const, label: t('wallet.transactions.allMethods') },
    ...PAYMENT_METHODS.map((value) => ({
      value,
      label: t(`wallet.transactions.methods.${value}`),
      icon: METHOD_ICONS[value],
    })),
  ]);
  const statusOptions = computed(() => [
    { value: '' as const, label: t('wallet.transactions.allStatuses') },
    ...TRANSACTION_STATUSES.map((value) => ({
      value,
      label: t(`wallet.transactions.statuses.${value}`),
    })),
  ]);

  return { methodOptions, statusOptions };
}
