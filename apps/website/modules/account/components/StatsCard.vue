<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import { statsQueryOptions } from '~/modules/account/queries';
  import { useAccountService } from '~/modules/account/services';
  import type { StatsDomain } from '~/modules/account/types';
  import AccountCard from './AccountCard.vue';

  /** Insurance policies and trips of the customer, by status ("suspended" is always 0) */
  const { t, locale } = useI18n();
  const service = useAccountService();

  const DOMAINS: { id: StatsDomain; icon: string }[] = [
    { id: 'insurance', icon: 'hugeicons--shield-user' },
    { id: 'transportation', icon: 'hugeicons--delivery-truck-01' },
  ];
  const blocks = DOMAINS.map((domain) => ({
    ...domain,
    query: useQuery(statsQueryOptions(service, domain.id)),
  }));
  const number = (n: number) => new Intl.NumberFormat(locale.value).format(n);
</script>

<template>
  <AccountCard id="account-stats" :title="t('account.stats.title')">
    <div class="stats">
      <section
        v-for="block in blocks"
        :key="block.id"
        class="stat"
        :aria-labelledby="`stats-${block.id}`"
      >
        <h3 :id="`stats-${block.id}`" class="stat__title">
          <span class="stat__icon"><Icon :icon="block.icon" class="size-5" /></span>
          {{ t(`account.stats.${block.id}`) }}
        </h3>
        <div v-if="block.query.isPending.value" class="stat__nums" aria-hidden="true">
          <Skeleton v-for="n in 3" :key="n" class="h-12 rounded-lg" />
        </div>
        <p v-else-if="block.query.isError.value" class="stat__error">
          {{ t('account.stats.unavailable') }}
        </p>
        <dl v-else class="stat__nums">
          <div v-for="field in ['total', 'active', 'inactive'] as const" :key="field" class="num">
            <dt>{{ t(`account.stats.${field}`) }}</dt>
            <dd>{{ number(block.query.data.value?.[field] ?? 0) }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </AccountCard>
</template>

<style scoped>
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
    gap: 16px;
  }
  .stat {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    background: var(--modal2);
  }
  .stat__title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--primary);
    font: 700 15px/22px var(--font);
  }
  .stat__icon {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: #fff;
  }
  .stat__nums {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .num {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    border-radius: 10px;
    background: #fff;
  }
  .num dt {
    color: var(--caption);
    font-size: 12px;
    line-height: 16px;
  }
  .num dd {
    order: -1;
    color: var(--primary);
    font: 700 22px/28px var(--font);
  }
  .stat__error {
    color: var(--caption);
    font-size: 14px;
  }
</style>
