<script setup lang="ts">
  import { stats } from '~/modules/home/data';

  const { t } = useI18n();
</script>

<template>
  <section class="section" aria-labelledby="stats-title">
    <SectionHeading
      id="stats-title"
      :eyebrow="t('home.stats.eyebrow')"
      :title="t('home.stats.title')"
    />
    <dl class="row container">
      <div v-for="id in stats" :key="id" class="stat">
        <dt>{{ t(`home.stats.items.${id}.label`) }}</dt>
        <dd>{{ t(`home.stats.items.${id}.value`) }}</dd>
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
