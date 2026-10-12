<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Button } from '@workspace/ui/ui/button';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import DepositDialog from '~/modules/wallet/components/DepositDialog.vue';
  import WalletAnalytics from '~/modules/wallet/components/WalletAnalytics.vue';
  import WalletBalanceCard from '~/modules/wallet/components/WalletBalanceCard.vue';
  import WalletPinCard from '~/modules/wallet/components/WalletPinCard.vue';
  import WalletTransactions from '~/modules/wallet/components/WalletTransactions.vue';
  import WithdrawalRequests from '~/modules/wallet/components/WithdrawalRequests.vue';
  import { useWallet } from '~/modules/wallet/composables/useWallet';
  import {
    ACTIVITY_LIMIT,
    useWalletActivity,
  } from '~/modules/wallet/composables/useWalletActivity';

  /**
   * The customer's wallet (as on ibbil.com/profile/wallet): balance and totals, PIN,
   * withdrawal requests, deposits vs withdrawals chart and the transaction history.
   */
  definePageMeta({ requiresAuth: true });

  const { t } = useI18n();
  useSeoMeta({ title: () => t('wallet.seo.title'), robots: 'noindex, nofollow' });

  const wallet = useServerPrefetch(useWallet());
  const walletId = computed(() => wallet.data.value?.walletId);
  const activity = useWalletActivity(walletId);
  const topUp = ref(false);
</script>

<template>
  <div class="page">
    <h1 id="profile-title" class="sr-only">{{ t('wallet.seo.title') }}</h1>

    <template v-if="wallet.isPending.value">
      <Skeleton class="h-[300px] rounded-[20px]" />
      <Skeleton class="h-[88px] rounded-[20px]" />
    </template>
    <div v-else-if="!wallet.data.value" class="state" role="alert">
      <Icon icon="hugeicons--alert-circle" class="size-7" />
      <p>{{ t('wallet.loadError') }}</p>
      <Button
        type="button"
        class="btn btn--primary"
        test-id="wallet-retry"
        @click="wallet.refetch()"
      >
        {{ t('wallet.retry') }}
      </Button>
    </div>
    <template v-else>
      <WalletBalanceCard
        :wallet="wallet.data.value"
        :totals="activity.isPending.value ? undefined : activity.totals.value"
        :partial-limit="activity.partial.value ? ACTIVITY_LIMIT : undefined"
        @top-up="topUp = true"
      />
      <WalletPinCard :status="wallet.data.value.status" />
      <WithdrawalRequests :items="activity.withdrawals.value" :loading="activity.isPending.value" />
      <WalletAnalytics
        :months="activity.months.value"
        :currency="wallet.data.value.currency"
        :has-activity="activity.hasActivity.value"
        :loading="activity.isPending.value"
      />
      <WalletTransactions :wallet-id="wallet.data.value.walletId" />
      <DepositDialog
        v-model:open="topUp"
        :wallet-id="wallet.data.value.walletId"
        :balance="wallet.data.value.availableBalance"
        :currency="wallet.data.value.currency"
      />
    </template>
  </div>
</template>

<style scoped>
  .page {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 48px 24px;
    border-radius: 20px;
    background: #fff;
    color: var(--caption);
    text-align: center;
  }
</style>
