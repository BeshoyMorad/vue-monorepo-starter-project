<script setup lang="ts">
  import { niceAxisTop, type MonthActivity } from '~/modules/wallet/activity';
  import type { WalletCurrency } from '~/modules/wallet/types';
  import WalletAmount from './WalletAmount.vue';

  /**
   * Grouped bars per month: deposits (green) and withdrawals (amber), checked with the
   * dataviz validator (2026-10-11: CVD ΔE 8.8, contrast ≥ 3:1 on white). Both are named in
   * the legend and the hover tooltip; screen readers get the same numbers as a table.
   */
  const props = defineProps<{
    months: MonthActivity[];
    currency: WalletCurrency;
    measure: 'amount' | 'count';
  }>();
  const { t, locale } = useI18n();

  const SERIES = [
    { id: 'deposits', color: '#2f7a4f' },
    { id: 'withdrawals', color: '#c47a12' },
  ] as const;

  const number = (n: number) =>
    new Intl.NumberFormat(`${locale.value}-u-nu-latn`, { maximumFractionDigits: 2 }).format(n);
  const compact = (n: number) =>
    new Intl.NumberFormat(`${locale.value}-u-nu-latn`, { notation: 'compact' }).format(n);
  const monthName = (date: Date) =>
    new Intl.DateTimeFormat(locale.value, { month: 'short' }).format(date);
  const monthLong = (date: Date) =>
    new Intl.DateTimeFormat(`${locale.value}-u-nu-latn`, {
      month: 'long',
      year: 'numeric',
    }).format(date);

  const valueOf = (month: MonthActivity, series: 'deposits' | 'withdrawals') =>
    month[series][props.measure];
  const top = computed(() =>
    niceAxisTop(
      Math.max(...props.months.flatMap((m) => [valueOf(m, 'deposits'), valueOf(m, 'withdrawals')]))
    )
  );
  const ticks = computed(() => [4, 3, 2, 1, 0].map((i) => (top.value / 4) * i));
  const height = (value: number) => `${(value / top.value) * 100}%`;

  // Bars grow from the baseline when shown and when the measure changes
  const drawn = ref(false);
  const draw = () => {
    drawn.value = false;
    requestAnimationFrame(() => requestAnimationFrame(() => (drawn.value = true)));
  };
  onMounted(draw);
  watch(() => props.measure, draw);

  const hovered = ref<number | null>(null);
  const summary = computed(() =>
    t('wallet.analytics.summary', {
      n: props.months.length,
      measure: t(`wallet.analytics.${props.measure}`),
    })
  );
</script>

<template>
  <div class="chart">
    <ul class="legend">
      <li v-for="series in SERIES" :key="series.id" class="legend__item">
        <span class="legend__dot" :style="{ background: series.color }" aria-hidden="true" />
        {{ t(`wallet.analytics.${series.id}`) }}
      </li>
    </ul>

    <div class="plot" aria-hidden="true">
      <div class="plot__axis">
        <span v-for="tick in ticks" :key="tick">{{ compact(tick) }}</span>
      </div>
      <div class="plot__area">
        <span v-for="n in 4" :key="n" class="plot__grid" :style="{ top: `${(n - 1) * 25}%` }" />
        <div
          v-for="(month, index) in months"
          :key="month.start.toISOString()"
          class="plot__month"
          @mouseenter="hovered = index"
          @mouseleave="hovered = null"
        >
          <div class="plot__bars">
            <span
              v-for="series in SERIES"
              :key="series.id"
              class="plot__bar"
              :style="{
                height: drawn ? height(valueOf(month, series.id)) : '0%',
                background: series.color,
              }"
            />
          </div>
          <span class="plot__label">{{ monthName(month.start) }}</span>
          <div v-if="hovered === index" class="tip">
            <p class="tip__title">{{ monthLong(month.start) }}</p>
            <p v-for="series in SERIES" :key="series.id" class="tip__row">
              <span class="legend__dot" :style="{ background: series.color }" />
              <span class="tip__name">{{ t(`wallet.analytics.${series.id}`) }}</span>
              <WalletAmount
                v-if="measure === 'amount'"
                :value="valueOf(month, series.id)"
                :currency="currency"
              />
              <span v-else>{{ number(valueOf(month, series.id)) }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <table class="sr-only">
      <caption>
        {{
          summary
        }}
      </caption>
      <thead>
        <tr>
          <th scope="col">{{ t('wallet.analytics.month') }}</th>
          <th v-for="series in SERIES" :key="series.id" scope="col">
            {{ t(`wallet.analytics.${series.id}`) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="month in months" :key="month.start.toISOString()">
          <th scope="row">{{ monthLong(month.start) }}</th>
          <td v-for="series in SERIES" :key="series.id">
            {{ number(valueOf(month, series.id)) }}
            <template v-if="measure === 'amount'">{{ t('wallet.currency') }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
  .chart {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    color: var(--text);
    font-size: 13px;
  }
  .legend__item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .legend__dot {
    width: 10px;
    height: 10px;
    flex: none;
    border-radius: 3px;
  }
  .plot {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    height: 240px;
    padding-bottom: 24px;
  }
  .plot__axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: var(--muted);
    font-size: 11px;
    line-height: 1;
    text-align: end;
  }
  .plot__area {
    position: relative;
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    border-bottom: 1px solid #d1d5db;
  }
  /* Recessive grid: hairlines at each step; the baseline is the area's bottom border */
  .plot__grid {
    position: absolute;
    inset-inline: 0;
    height: 1px;
    background: #f1f2f1;
  }
  .plot__month {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    border-radius: 8px 8px 0 0;
  }
  .plot__month:hover {
    background: rgb(45 83 61 / 0.04);
  }
  .plot__bars {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 100%;
  }
  .plot__bar {
    width: clamp(8px, 2.2vw, 18px);
    border-radius: 4px 4px 0 0;
    transition: height 600ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .plot__label {
    position: absolute;
    bottom: -22px;
    color: var(--caption);
    font-size: 12px;
    white-space: nowrap;
  }
  .tip {
    position: absolute;
    top: 8px;
    z-index: 2;
    min-width: 170px;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.2);
    font-size: 12px;
    pointer-events: none;
  }
  .tip__title {
    margin-bottom: 6px;
    color: var(--text);
    font-weight: 700;
  }
  .tip__row {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text);
  }
  .tip__name {
    flex: 1;
    color: var(--caption);
  }
  @media (prefers-reduced-motion: reduce) {
    .plot__bar {
      transition: none;
    }
  }
</style>
