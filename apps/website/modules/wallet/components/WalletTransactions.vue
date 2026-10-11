<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Button } from '@workspace/ui/ui/button';
  import { Input } from '@workspace/ui/ui/input';
  import { NativeSelect, NativeSelectOption } from '@workspace/ui/ui/native-select';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import SearchPager from '~/modules/search/components/SearchPager.vue';
  import { historyQueryOptions } from '~/modules/wallet/queries';
  import { useWalletService } from '~/modules/wallet/services';
  import {
    PAYMENT_METHODS,
    TRANSACTION_STATUSES,
    type PaymentMethod,
    type TransactionStatus,
  } from '~/modules/wallet/types';
  import TransactionItem from './TransactionItem.vue';

  /**
   * "Financial transactions": the wallet's history, filtered by reference, payment method and
   * status, ten per page. The API matches the reference exactly, so the search runs on Enter
   * instead of while typing.
   */
  const props = defineProps<{ walletId: string }>();
  const { t, locale } = useI18n();
  const service = useWalletService();
  const PAGE_SIZE = 10;

  const typed = ref('');
  const ref_ = ref('');
  const paymentMethod = ref<PaymentMethod | ''>('');
  const status = ref<TransactionStatus | ''>('');
  const page = ref(1);
  watch([ref_, paymentMethod, status], () => (page.value = 1));

  const params = computed(() => ({
    walletId: props.walletId,
    page: page.value,
    limit: PAGE_SIZE,
    ref: ref_.value || undefined,
    paymentMethod: paymentMethod.value || undefined,
    status: status.value || undefined,
  }));
  const history = useQuery(computed(() => historyQueryOptions(service, params.value)));

  const filtered = computed(() => Boolean(ref_.value || paymentMethod.value || status.value));
  const total = computed(() => history.data.value?.meta.total ?? 0);
  const count = computed(() =>
    t(
      'wallet.transactions.count',
      {
        n: new Intl.NumberFormat(`${locale.value}-u-nu-latn`).format(total.value),
      },
      total.value
    )
  );
  const search = () => {
    ref_.value = typed.value.trim();
  };
  // Emptying the box shows every transaction again
  watch(typed, (value) => {
    if (!value.trim()) ref_.value = '';
  });
  const clear = () => {
    typed.value = '';
    ref_.value = '';
    paymentMethod.value = '';
    status.value = '';
  };
  const list = ref<HTMLElement>();
  const toPage = (n: number) => {
    page.value = n;
    list.value?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
</script>

<template>
  <section ref="list" class="tx" aria-labelledby="wallet-transactions">
    <header class="tx__head">
      <h2 id="wallet-transactions" class="tx__title">{{ t('wallet.transactions.title') }}</h2>
      <p class="tx__count" aria-live="polite">{{ count }}</p>
    </header>

    <div class="filters" role="search" :aria-label="t('wallet.transactions.filters')">
      <form class="field field--search" @submit.prevent="search">
        <Icon icon="hugeicons--search-01" class="field__icon size-4" aria-hidden="true" />
        <Input
          v-model="typed"
          type="search"
          data-test-id="wallet-search"
          class="field__control ui-bare"
          enterkeyhint="search"
          :placeholder="t('wallet.transactions.search')"
          :aria-label="t('wallet.transactions.search')"
          :title="t('wallet.transactions.searchHint')"
        />
      </form>
      <NativeSelect
        v-model="paymentMethod"
        data-test-id="wallet-method"
        class="field__control field__select ui-bare"
        :aria-label="t('wallet.transactions.method')"
      >
        <NativeSelectOption value="">{{ t('wallet.transactions.allMethods') }}</NativeSelectOption>
        <NativeSelectOption v-for="method in PAYMENT_METHODS" :key="method" :value="method">
          {{ t(`wallet.transactions.methods.${method}`) }}
        </NativeSelectOption>
      </NativeSelect>
      <NativeSelect
        v-model="status"
        data-test-id="wallet-status"
        class="field__control field__select ui-bare"
        :aria-label="t('wallet.transactions.statusLabel')"
      >
        <NativeSelectOption value="">{{ t('wallet.transactions.allStatuses') }}</NativeSelectOption>
        <NativeSelectOption v-for="value in TRANSACTION_STATUSES" :key="value" :value="value">
          {{ t(`wallet.transactions.statuses.${value}`) }}
        </NativeSelectOption>
      </NativeSelect>
    </div>

    <div v-if="history.isPending.value" class="tx__list" aria-hidden="true">
      <Skeleton v-for="n in 3" :key="n" class="m-4 h-12 rounded-xl" />
    </div>
    <div v-else-if="history.isError.value" class="tx__state" role="alert">
      <p>{{ t('wallet.loadError') }}</p>
      <Button
        type="button"
        class="btn btn--outline"
        test-id="wallet-tx-retry"
        @click="history.refetch()"
      >
        {{ t('wallet.retry') }}
      </Button>
    </div>
    <template v-else-if="history.data.value?.items.length">
      <ul class="tx__list" :aria-busy="history.isFetching.value">
        <TransactionItem
          v-for="item in history.data.value.items"
          :key="item.transactionId"
          :item="item"
        />
      </ul>
      <SearchPager
        v-if="history.data.value.meta.totalPages > 1"
        :meta="history.data.value.meta"
        :label="t('wallet.transactions.pagination')"
        @change="toPage"
      />
    </template>
    <EmptyState
      v-else-if="filtered"
      icon="hugeicons--search-remove"
      :title="t('wallet.transactions.noMatchTitle')"
      :description="t('wallet.transactions.noMatchText')"
    >
      <Button type="button" class="btn btn--outline" test-id="wallet-tx-clear" @click="clear">
        {{ t('wallet.transactions.clear') }}
      </Button>
    </EmptyState>
    <EmptyState
      v-else
      icon="hugeicons--invoice-03"
      :title="t('wallet.transactions.emptyTitle')"
      :description="t('wallet.transactions.emptyText')"
    />
  </section>
</template>

<style scoped>
  .tx {
    display: flex;
    flex-direction: column;
    gap: 16px;
    scroll-margin-top: 140px;
  }
  .tx__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .tx__title {
    color: var(--primary);
    font: 700 18px/26px var(--font);
  }
  .tx__count {
    color: var(--caption);
    font-size: 13px;
  }
  .filters {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
    padding: 14px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .field {
    position: relative;
  }
  .field__icon {
    position: absolute;
    top: 50%;
    inset-inline-start: 14px;
    color: var(--muted);
    transform: translateY(-50%);
    pointer-events: none;
  }
  .field__control {
    width: 100%;
    height: 42px;
    padding-inline: 14px;
    border: 1px solid #e5e7eb;
    border-radius: 99px;
    background: #fafafa;
    color: var(--text);
    font: 500 14px/20px var(--font);
  }
  .field--search .field__control {
    padding-inline-start: 38px;
  }
  .field__control:focus-visible {
    border-color: var(--color-primary-500);
    outline: none;
    box-shadow: 0 0 0 3px rgb(45 83 61 / 0.16);
  }
  .field__select {
    padding-inline-end: 36px;
    appearance: none;
    cursor: pointer;
  }
  /* The kit's select chevron sits on the right: put it on the end side in both directions */
  .filters :deep([data-slot='native-select-wrapper']) {
    width: 100%;
  }
  .filters :deep([data-slot='native-select-icon']) {
    right: auto;
    inset-inline-end: 14px;
  }
  .tx__list {
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .tx__list[aria-busy='true'] {
    opacity: 0.6;
  }
  .tx__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 16px;
    border-radius: 16px;
    background: #fff;
    color: var(--caption);
  }
  @media (max-width: 760px) {
    .filters {
      grid-template-columns: 1fr 1fr;
    }
    .field--search {
      grid-column: 1 / -1;
    }
  }
</style>
