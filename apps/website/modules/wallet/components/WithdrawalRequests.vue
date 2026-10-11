<script setup lang="ts">
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import type { WalletTransaction } from '~/modules/wallet/types';
  import TransactionItem from './TransactionItem.vue';

  /** The customer's withdrawals (latest first), or the dashed "none yet" box of the design */
  defineProps<{ items: WalletTransaction[]; loading?: boolean }>();
  const { t } = useI18n();
  const SHOWN = 5;
</script>

<template>
  <section class="requests" aria-labelledby="wallet-requests">
    <h2 id="wallet-requests" class="requests__title">{{ t('wallet.requests.title') }}</h2>
    <Skeleton v-if="loading" class="h-[72px] rounded-2xl" />
    <ul v-else-if="items.length" class="requests__list">
      <TransactionItem
        v-for="item in items.slice(0, SHOWN)"
        :key="item.transactionId"
        :item="item"
      />
    </ul>
    <p v-else class="requests__empty">{{ t('wallet.requests.empty') }}</p>
  </section>
</template>

<style scoped>
  .requests {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .requests__title {
    color: var(--primary);
    font: 700 18px/26px var(--font);
  }
  .requests__list {
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .requests__empty {
    padding: 22px 16px;
    border: 1px dashed #d1d5db;
    border-radius: 16px;
    color: var(--caption);
    font-size: 14px;
    text-align: center;
  }
</style>
