<script setup lang="ts">
  import type { CustomerStats } from '~/modules/account/types';

  /**
   * Status breakdown of one domain: doughnut (total in the middle) or horizontal bars.
   * Colors are fixed per status and checked for color-blind separation and 3:1 contrast
   * (dataviz validator, 2026-10-05); the legend repeats every value as text.
   */
  const props = defineProps<{ stats: CustomerStats; view: 'doughnut' | 'bar'; label: string }>();
  const { t, locale } = useI18n();

  const COLORS = { active: '#2f7a4f', inactive: '#3f7fd0', suspended: '#d9480f' } as const;
  const STATUSES = ['active', 'inactive', 'suspended'] as const;
  const number = (n: number) => new Intl.NumberFormat(locale.value).format(n);

  const parts = computed(() =>
    STATUSES.map((status) => ({
      status,
      label: t(`account.overview.${status}`),
      value: props.stats[status] ?? 0,
      color: COLORS[status],
    }))
  );
  const shown = computed(() => parts.value.filter((part) => part.value > 0));
  const sum = computed(() => shown.value.reduce((total, part) => total + part.value, 0));
  const summary = computed(
    () =>
      `${props.label}: ${t('account.overview.total')} ${number(props.stats.total)}, ` +
      parts.value.map((part) => `${part.label} ${number(part.value)}`).join(', ')
  );

  // Doughnut arcs on a 100×100 viewBox, with a 2px gap between segments
  const R = 40;
  const C = 2 * Math.PI * R;
  const arcs = computed(() => {
    const GAP = shown.value.length > 1 ? 1.2 : 0;
    let offset = 0;
    return shown.value.map((part) => {
      const length = (part.value / sum.value) * C;
      const arc = { ...part, dash: `${Math.max(length - GAP, 0)} ${C}`, offset: -offset };
      offset += length;
      return arc;
    });
  });
  const max = computed(() => Math.max(...parts.value.map((part) => part.value), 1));

  // Drawn in: arcs sweep and bars grow from zero when shown (and when the view changes)
  const drawn = ref(false);
  const draw = () => {
    drawn.value = false;
    requestAnimationFrame(() => requestAnimationFrame(() => (drawn.value = true)));
  };
  onMounted(draw);
  watch(() => props.view, draw);
</script>

<template>
  <div class="chart">
    <div class="chart__plot">
      <svg
        v-if="view === 'doughnut'"
        viewBox="0 0 100 100"
        class="donut"
        role="img"
        :aria-label="summary"
      >
        <circle cx="50" cy="50" :r="R" fill="none" stroke="#eef0ef" stroke-width="13" />
        <circle
          v-for="arc in arcs"
          :key="arc.status"
          cx="50"
          cy="50"
          :r="R"
          fill="none"
          :stroke="arc.color"
          stroke-width="13"
          :stroke-dasharray="drawn ? arc.dash : `0 ${C}`"
          :stroke-dashoffset="arc.offset"
          transform="rotate(-90 50 50)"
          class="donut__arc"
        >
          <title>{{ arc.label }}: {{ number(arc.value) }}</title>
        </circle>
        <text x="50" y="50" text-anchor="middle" class="donut__total">
          {{ number(stats.total) }}
        </text>
        <text x="50" y="60" text-anchor="middle" class="donut__caption">
          {{ t('account.overview.total') }}
        </text>
      </svg>
      <div v-else class="bars" role="img" :aria-label="summary">
        <div v-for="part in parts" :key="part.status" class="bars__row">
          <span class="bars__label">{{ part.label }}</span>
          <span class="bars__track">
            <span
              class="bars__fill"
              :style="{
                width: drawn ? `${(part.value / max) * 100}%` : '0%',
                background: part.color,
              }"
              :title="`${part.label}: ${number(part.value)}`"
            />
          </span>
          <span class="bars__value">{{ number(part.value) }}</span>
        </div>
      </div>
    </div>

    <ul class="legend">
      <li
        v-for="part in view === 'doughnut' ? shown : parts"
        :key="part.status"
        class="legend__item"
      >
        <span class="legend__dot" :style="{ background: part.color }" aria-hidden="true" />
        <span class="legend__label">{{ part.label }}</span>
        <span class="legend__value">{{ number(part.value) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .chart {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: 32px;
  }
  .chart__plot {
    display: grid;
    place-items: center;
  }
  .donut {
    width: min(100%, 250px);
  }
  .donut__arc {
    transition:
      stroke-dasharray 700ms cubic-bezier(0.2, 0.8, 0.2, 1),
      stroke-width 0.15s;
  }
  .donut__arc:hover {
    stroke-width: 15;
  }
  .donut__total {
    fill: var(--primary);
    font: 700 14px var(--font);
  }
  .donut__caption {
    fill: var(--caption);
    font: 500 5px var(--font);
  }
  .bars {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .bars__row {
    display: grid;
    grid-template-columns: 80px 1fr 32px;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }
  .bars__label {
    color: var(--caption);
  }
  .bars__track {
    height: 14px;
    border-radius: 4px;
    background: #f3f4f6;
  }
  .bars__fill {
    transition: width 600ms cubic-bezier(0.2, 0.8, 0.2, 1);
    display: block;
    height: 100%;
    min-width: 0;
    border-radius: 4px;
  }
  .bars__value {
    color: var(--text);
    font-weight: 600;
    text-align: end;
  }
  .legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .legend__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1px solid #eef0ef;
    border-radius: 10px;
    font-size: 14px;
  }
  .legend__dot {
    width: 10px;
    height: 10px;
    flex: none;
    border-radius: 50%;
  }
  .legend__label {
    flex: 1;
    color: var(--text);
  }
  .legend__value {
    color: var(--text);
    font-weight: 700;
  }
  @media (prefers-reduced-motion: reduce) {
    .donut__arc,
    .bars__fill {
      transition: none;
    }
  }
  @media (max-width: 640px) {
    .chart {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
</style>
