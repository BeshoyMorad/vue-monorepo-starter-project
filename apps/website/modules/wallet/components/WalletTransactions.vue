<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Button } from '@workspace/ui/ui/button';
  import { Input } from '@workspace/ui/ui/input';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import FilterSelect from '~/components/FilterSelect.vue';
  import SearchPager from '~/modules/search/components/SearchPager.vue';
  import { useHistoryFilterOptions } from '~/modules/wallet/composables/useHistoryFilterOptions';
  import { SEARCH_POOL, useWalletHistory } from '~/modules/wallet/composables/useWalletHistory';
  import TransactionItem from './TransactionItem.vue';

  /**
   * "Financial transactions": the wallet's history with search, payment-method and status
   * filters, ten per page (see useWalletHistory for how the search works).
   */
  const props = defineProps<{ walletId: string }>();
  const { t, locale } = useI18n();
  const {
    typed,
    paymentMethod,
    status,
    page,
    history,
    shown,
    searchPartial,
    filtered,
    search,
    clear,
  } = useWalletHistory(() => props.walletId);
  const { methodOptions, statusOptions } = useHistoryFilterOptions();

  const total = computed(() => shown.value?.meta.total ?? 0);
  const count = computed(() =>
    t(
      'wallet.transactions.count',
      { n: new Intl.NumberFormat(`${locale.value}-u-nu-latn`).format(total.value) },
      total.value
    )
  );
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
    <p v-if="searchPartial" class="tx__note">
      {{ t('wallet.transactions.searchPartial', { n: SEARCH_POOL }) }}
    </p>

    <div class="filters" role="search" :aria-label="t('wallet.transactions.filters')">
      <form class="field field--search" @submit.prevent="search">
        <Icon icon="hugeicons--search-01" class="field__icon size-4" aria-hidden="true" />
        <Input
          v-model="typed"
          type="text"
          data-test-id="wallet-search"
          class="field__control ui-bare"
          enterkeyhint="search"
          :placeholder="t('wallet.transactions.search')"
          :aria-label="t('wallet.transactions.search')"
          :title="t('wallet.transactions.searchHint')"
        />
        <Button
          v-if="typed"
          type="button"
          class="field__clear ui-bare"
          test-id="wallet-search-clear"
          :aria-label="t('wallet.transactions.clearSearch')"
          @click="typed = ''"
        >
          <Icon icon="hugeicons--cancel-01" class="size-3.5" />
        </Button>
      </form>
      <FilterSelect
        v-model="paymentMethod"
        test-id="wallet-method"
        :label="t('wallet.transactions.method')"
        :options="methodOptions"
      />
      <FilterSelect
        v-model="status"
        test-id="wallet-status"
        :label="t('wallet.transactions.statusLabel')"
        :options="statusOptions"
      />
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
    <template v-else-if="shown?.items.length">
      <ul class="tx__list" :aria-busy="history.isFetching.value">
        <TransactionItem v-for="item in shown.items" :key="item.transactionId" :item="item" />
      </ul>
      <SearchPager
        v-if="shown.meta.totalPages > 1"
        :meta="shown.meta"
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
  .tx__note {
    margin-top: -8px;
    color: var(--caption);
    font-size: 12px;
  }
  .tx__count {
    color: var(--caption);
    font-size: 13px;
  }
  .filters {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 14px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .field {
    position: relative;
    display: flex;
    align-items: center;
  }
  .field__icon {
    position: absolute;
    inset-inline-start: 16px;
    color: var(--muted);
    pointer-events: none;
  }
  /* Same height, radius and fill as the filter dropdowns next to it */
  .field__control {
    width: 100%;
    height: 44px;
    padding-inline: 42px 44px;
    border: 1px solid #e5e7eb;
    border-radius: 99px;
    background: #fafafa;
    color: var(--text);
    font: 500 14px/20px var(--font);
    transition:
      border-color 150ms,
      background-color 150ms;
  }
  .field__clear {
    position: absolute;
    inset-inline-end: 10px;
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #eef0ef;
    color: var(--caption);
    cursor: pointer;
  }
  .field__clear:hover {
    background: var(--color-primary-50);
    color: var(--color-primary-500);
  }
  .field__clear:focus-visible {
    outline: 2px solid rgb(45 83 61 / 0.45);
    outline-offset: 2px;
  }
  .field__control::placeholder {
    color: var(--muted);
  }
  .field__control:hover {
    border-color: var(--color-primary-200);
    background: #fff;
  }
  .field__control:focus-visible {
    border-color: var(--color-primary-500);
    outline: none;
    background: #fff;
    box-shadow: 0 0 0 3px rgb(45 83 61 / 0.16);
  }
  @media (max-width: 760px) {
    .filters {
      grid-template-columns: 1fr 1fr;
    }
    .field {
      grid-column: 1 / -1;
    }
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
</style>
