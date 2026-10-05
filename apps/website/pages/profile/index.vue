<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import { Skeleton } from '@workspace/ui/ui/skeleton';
  import StatusChart from '~/modules/account/components/StatusChart.vue';
  import { useGlideMarker } from '~/modules/account/composables/useGlideMarker';
  import { useProfileStats } from '~/modules/account/composables/useProfileStats';

  /** Profile overview (ibbil.com/en/profile): statistics of each section of the platform */
  definePageMeta({ requiresAuth: true });

  const { t, locale } = useI18n();
  useSeoMeta({ title: () => t('account.seo.overview'), robots: 'noindex, nofollow' });

  const { domains, selected, byDomain, current, isRefreshing, refresh } = useProfileStats();
  const view = ref<'doughnut' | 'bar'>('doughnut');
  const number = (n: number) => new Intl.NumberFormat(locale.value).format(n);

  const TILES = [
    { id: 'total', icon: 'hugeicons--user-group', tone: 'gold' },
    { id: 'active', icon: 'hugeicons--user-check-01', tone: 'grey' },
    { id: 'inactive', icon: 'hugeicons--user-remove-01', tone: 'grey' },
    { id: 'suspended', icon: 'hugeicons--user-block-01', tone: 'gold' },
  ] as const;
  const domainLabel = computed(() => t(`account.overview.domains.${selected.value}`));

  // The selected tab's fill glides to the newly picked section
  const tabList = ref<HTMLElement>();
  const tab = useGlideMarker(tabList, () => selected.value, '[aria-pressed=true]');
</script>

<template>
  <div class="page">
    <h1 id="profile-title" class="sr-only">{{ t('account.seo.overview') }}</h1>
    <div class="bar">
      <div
        ref="tabList"
        class="tabs"
        :class="{ 'tabs--glide': tab.box.value }"
        role="group"
        :aria-label="t('account.overview.tabsLabel')"
      >
        <span
          v-if="tab.box.value"
          class="tabs__marker"
          :class="{ 'tabs__marker--animate': tab.animate.value }"
          :style="tab.style.value"
          aria-hidden="true"
        />
        <button
          v-for="domain in domains"
          :key="domain"
          type="button"
          class="tab"
          :aria-pressed="selected === domain"
          @click="selected = domain"
        >
          {{ t(`account.overview.domains.${domain}`) }}
          <span class="tab__count">{{ number(byDomain[domain]?.data?.total ?? 0) }}</span>
        </button>
      </div>
      <button type="button" class="refresh" :aria-busy="isRefreshing" @click="refresh">
        <Icon icon="hugeicons--refresh" class="size-4" :class="{ 'animate-spin': isRefreshing }" />
        {{ t('account.overview.refresh') }}
      </button>
    </div>

    <!-- Switching section: the numbers and chart fade out and the new ones in -->
    <Transition name="profile-fade" mode="out-in">
      <div :key="selected" class="page">
        <div v-if="current?.isPending" class="tiles" aria-hidden="true">
          <Skeleton v-for="n in 4" :key="n" class="h-[116px] rounded-2xl" />
        </div>
        <div v-else-if="current?.isError" class="card state" role="alert">
          <p>{{ t('account.overview.unavailable') }}</p>
          <button type="button" class="btn btn--outline" @click="current?.refetch()">
            {{ t('account.overview.retry') }}
          </button>
        </div>
        <template v-else-if="current?.data">
          <ul class="tiles">
            <li v-for="tile in TILES" :key="tile.id" class="tile">
              <span class="tile__icon" :class="`tile__icon--${tile.tone}`" aria-hidden="true">
                <Icon :icon="tile.icon" class="size-5" />
              </span>
              <span class="tile__label">{{ t(`account.overview.${tile.id}`) }}</span>
              <span class="tile__value">{{ number(current.data[tile.id] ?? 0) }}</span>
            </li>
          </ul>

          <section class="card breakdown" aria-labelledby="breakdown-title">
            <header class="breakdown__head">
              <div>
                <h2 id="breakdown-title" class="breakdown__title">
                  {{ t('account.overview.breakdown') }}
                </h2>
                <p class="breakdown__domain">{{ domainLabel }}</p>
              </div>
              <div class="switch" role="group" :aria-label="t('account.overview.chartType')">
                <button
                  v-for="type in ['doughnut', 'bar'] as const"
                  :key="type"
                  type="button"
                  :aria-pressed="view === type"
                  @click="view = type"
                >
                  {{ t(`account.overview.${type}`) }}
                </button>
              </div>
            </header>
            <StatusChart
              v-if="current.data.total > 0"
              :stats="current.data"
              :view="view"
              :label="domainLabel"
            />
            <p v-else class="breakdown__empty">{{ t('account.overview.empty') }}</p>
          </section>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .page {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .tabs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .tabs__marker {
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid var(--color-primary-200);
    border-radius: 10px;
    background: var(--color-primary-50);
    pointer-events: none;
  }
  .tabs__marker--animate {
    transition:
      transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1),
      width 300ms cubic-bezier(0.2, 0.8, 0.2, 1),
      height 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  /* With the marker in place, the pressed tab is see-through so the marker shows */
  .tabs--glide .tab[aria-pressed='true'] {
    border-color: transparent;
    background: transparent;
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs__marker--animate {
      transition: none;
    }
  }
  .tab,
  .refresh {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 6px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    color: var(--primary);
    font: 600 14px/20px var(--font);
    cursor: pointer;
  }
  .tab:hover,
  .refresh:hover {
    background: #f3f4f6;
  }
  .tab[aria-pressed='true'] {
    border-color: var(--color-primary-200);
    background: var(--color-primary-50);
  }
  .tab__count {
    min-width: 22px;
    padding: 0 6px;
    border-radius: 99px;
    background: #f3f4f6;
    font-size: 12px;
    text-align: center;
  }
  .tab[aria-pressed='true'] .tab__count {
    background: #fff;
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
  /* Icon at the start, number at the end, label underneath (as in the design) */
  .tile {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'icon value' 'label label';
    align-items: start;
    gap: 14px 8px;
    padding: 20px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .tile__icon {
    grid-area: icon;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 12px;
  }
  .tile__icon--gold {
    background: var(--color-gold-50);
    color: var(--color-gold-700);
  }
  .tile__icon--grey {
    background: #f3f4f6;
    color: var(--caption);
  }
  .tile__value {
    grid-area: value;
    color: var(--primary);
    font: 700 26px/32px var(--font);
    text-align: end;
  }
  .tile__label {
    grid-area: label;
    color: var(--caption);
    font-size: 15px;
  }
  .card {
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 40px 24px;
    color: var(--caption);
  }
  .breakdown {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    border-top: 3px solid var(--color-gold-500);
  }
  .breakdown__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .breakdown__title {
    color: var(--primary);
    font: 700 20px/28px var(--font);
  }
  .breakdown__domain {
    margin-top: 4px;
    color: var(--caption);
    font-size: 15px;
  }
  .breakdown__empty {
    padding: 40px 0;
    color: var(--caption);
    text-align: center;
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
  @media (max-width: 1100px) {
    .tiles {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
