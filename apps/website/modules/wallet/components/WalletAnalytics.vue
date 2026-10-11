<script setup lang="ts">
  import { Button } from '@workspace/ui/ui/button';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import type { MonthActivity } from '~/modules/wallet/activity';
  import type { WalletCurrency } from '~/modules/wallet/types';
  import ActivityChart from './ActivityChart.vue';

  /** "Wallet analytics": deposits vs withdrawals per month, by amount or by count */
  defineProps<{
    months: MonthActivity[];
    currency: WalletCurrency;
    hasActivity: boolean;
    loading?: boolean;
  }>();
  const { t } = useI18n();
  const measure = ref<'amount' | 'count'>('amount');
</script>

<template>
  <section class="card" aria-labelledby="wallet-analytics">
    <header class="card__head">
      <div>
        <h2 id="wallet-analytics" class="card__title">{{ t('wallet.analytics.title') }}</h2>
        <p class="card__text">{{ t('wallet.analytics.text') }}</p>
      </div>
      <div
        v-if="hasActivity"
        class="switch"
        role="group"
        :aria-label="t('wallet.analytics.measure')"
      >
        <Button
          v-for="type in ['amount', 'count'] as const"
          :key="type"
          type="button"
          class="ui-bare"
          :test-id="`wallet-chart-${type}`"
          :aria-pressed="measure === type"
          @click="measure = type"
        >
          {{ t(`wallet.analytics.${type}`) }}
        </Button>
      </div>
    </header>

    <Skeleton v-if="loading" class="h-64 rounded-2xl" />
    <EmptyState
      v-else-if="!hasActivity"
      icon="hugeicons--wallet-01"
      :title="t('wallet.analytics.emptyTitle')"
      :description="t('wallet.analytics.emptyText')"
    />
    <template v-else>
      <ActivityChart :months="months" :currency="currency" :measure="measure" />
    </template>
  </section>
</template>

<style scoped>
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 20px;
    border-radius: 20px 20px 0 0;
    background: linear-gradient(
        to right,
        var(--color-primary-500),
        var(--color-gold-500),
        var(--color-primary-500)
      )
      top / 100% 3px no-repeat;
    pointer-events: none;
  }
  .card__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .card__title {
    color: var(--primary);
    font: 700 20px/28px var(--font);
  }
  .card__text {
    margin-top: 4px;
    color: var(--caption);
    font-size: 14px;
  }
  .switch {
    display: inline-flex;
    padding: 4px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }
  .switch button {
    min-height: 32px;
    padding: 4px 12px;
    border-radius: 8px;
    color: var(--text);
    font: 600 13px/20px var(--font);
    cursor: pointer;
  }
  .switch button[aria-pressed='true'] {
    background: #fff;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
  }
  @media (max-width: 640px) {
    .card {
      padding: 20px 16px;
    }
  }
</style>
