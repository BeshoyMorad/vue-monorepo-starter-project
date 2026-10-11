<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  import { stats } from '~/modules/home/data';
  import { platformStatsQueryOptions } from '~/modules/home/queries';
  import { useHomeService } from '~/modules/home/services';

  /**
   * Live platform totals (GET /stats/platform), fetched during server rendering so the page
   * arrives with the numbers. A count the API could not compute shows a dash.
   */
  const { t, locale } = useI18n();
  const { data } = useServerPrefetch(useQuery(platformStatsQueryOptions(useHomeService())));

  // Western digits in both languages, as elsewhere on the homepage
  const format = (n: number) => new Intl.NumberFormat(`${locale.value}-u-nu-latn`).format(n);
  const value = (key: (typeof stats)[number]['key']) => {
    const n = data.value?.[key];
    return typeof n === 'number' ? format(n) : null;
  };
</script>

<template>
  <section class="section" aria-labelledby="stats-title">
    <SectionHeading
      id="stats-title"
      :eyebrow="t('home.stats.eyebrow')"
      :title="t('home.stats.title')"
    />
    <dl class="row container">
      <div v-for="item in stats" :key="item.id" class="stat">
        <dt>{{ t(`home.stats.items.${item.id}`) }}</dt>
        <dd v-if="value(item.key) !== null">{{ value(item.key) }}</dd>
        <dd v-else>
          <span aria-hidden="true">—</span>
          <span class="sr-only">{{ t('home.stats.unavailable') }}</span>
        </dd>
        <span class="stat__rule" aria-hidden="true" />
      </div>
    </dl>
  </section>
</template>

<style scoped>
  .row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 24px;
  }
  /* The number reads first visually; dt/dd keep label and value paired for screen readers */
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }
  dd {
    order: -1;
    color: var(--primary);
    font: 700 36px/40px var(--font);
  }
  dt {
    min-height: 24px;
    color: var(--caption);
    font: 500 16px/24px var(--font);
  }
  .stat__rule {
    width: 32px;
    height: 2px;
    background: var(--secondary);
  }
  @media (max-width: 900px) {
    .row {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media (max-width: 480px) {
    .row {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px 12px;
    }
    dd {
      font-size: 28px;
      line-height: 34px;
    }
    dt {
      font-size: 14px;
      line-height: 20px;
    }
  }
</style>
