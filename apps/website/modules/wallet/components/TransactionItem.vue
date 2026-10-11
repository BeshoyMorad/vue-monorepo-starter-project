<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { INFLOW_DOMAINS, type WalletTransaction } from '~/modules/wallet/types';
  import TransactionStatus from './TransactionStatus.vue';
  import WalletAmount from './WalletAmount.vue';

  /** One row of the history: what it was, its reference and date, amount and status */
  const props = defineProps<{ item: WalletTransaction }>();
  const { t, locale } = useI18n();

  const ICONS: Partial<Record<WalletTransaction['domain'], string>> = {
    DEPOSIT: 'hugeicons--arrow-down-left-01',
    WITHDRAWAL: 'hugeicons--bank',
    REFUND: 'hugeicons--undo-02',
    MARKETPLACE: 'hugeicons--store-01',
    TRANSPORTATION: 'hugeicons--delivery-truck-01',
    VETERINARY: 'hugeicons--stethoscope',
    INSURANCE: 'hugeicons--shield-01',
    P2P: 'hugeicons--arrow-data-transfer-horizontal',
    FEE: 'hugeicons--receipt-dollar',
  };
  const inflow = computed(() => INFLOW_DOMAINS.includes(props.item.domain));
  const date = computed(() =>
    new Intl.DateTimeFormat(`${locale.value}-u-nu-latn`, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(props.item.createdAt))
  );
</script>

<template>
  <li class="row">
    <span class="row__icon" :class="{ 'row__icon--in': inflow }" aria-hidden="true">
      <Icon :icon="ICONS[item.domain] ?? 'hugeicons--wallet-01'" class="size-5" />
    </span>
    <div class="row__main">
      <p class="row__title">{{ t(`wallet.transactions.domains.${item.domain}`) }}</p>
      <p class="row__meta">
        <bdi dir="ltr">{{ t('wallet.transactions.ref', { ref: item.ref }) }}</bdi>
        <span aria-hidden="true">·</span>
        <time :datetime="item.createdAt">{{ date }}</time>
      </p>
    </div>
    <div class="row__end">
      <WalletAmount
        class="row__amount"
        :class="{ 'row__amount--in': inflow }"
        :value="item.amount"
        :currency="item.currency"
        :sign="inflow ? '+' : '−'"
      />
      <TransactionStatus :status="item.status" />
    </div>
  </li>
</template>

<style scoped>
  .row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
  }
  .row + .row {
    border-top: 1px solid #eef0ef;
  }
  .row__icon {
    width: 42px;
    height: 42px;
    display: grid;
    flex: none;
    place-items: center;
    border-radius: 12px;
    background: #f3f4f6;
    color: var(--caption);
  }
  .row__icon--in {
    background: var(--color-primary-50);
    color: var(--color-primary-600);
  }
  .row__main {
    flex: 1;
    min-width: 0;
  }
  .row__title {
    color: var(--text);
    font: 600 15px/22px var(--font);
  }
  .row__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    color: var(--caption);
    font-size: 12px;
    line-height: 18px;
  }
  .row__end {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  .row__amount {
    color: var(--text);
    font: 700 15px/22px var(--font);
  }
  .row__amount--in {
    color: var(--color-primary-600);
  }
</style>
