<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { services } from '~/modules/home/data';

  const { t } = useI18n();
</script>

<template>
  <section id="services" class="section services" aria-labelledby="services-title">
    <SectionHeading
      id="services-title"
      :eyebrow="t('home.services.eyebrow')"
      :title="t('home.services.title')"
      :text="t('home.services.text')"
    />
    <ul class="container grid">
      <li v-for="item in services" :key="item.id" class="card">
        <div class="slot">
          <span class="slot__icon"><Icon :icon="item.icon" class="size-12" /></span>
        </div>
        <h3>{{ t(`home.services.items.${item.id}.title`) }}</h3>
        <p>{{ t(`home.services.items.${item.id}.text`) }}</p>
        <a class="btn btn--glass card__cta" href="#">
          {{ t('home.services.explore') }}
          <span class="sr-only">: {{ t(`home.services.items.${item.id}.title`) }}</span>
          <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
  .services {
    background: var(--modal2);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .card {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 24px 24px;
    border-radius: var(--radius);
    background: #fff;
  }
  .slot {
    width: 100%;
    height: 136px;
    display: grid;
    place-items: center;
  }
  .slot__icon {
    width: 112px;
    height: 112px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--chip);
    color: var(--primary);
  }
  h3 {
    color: var(--primary);
    font: 700 18px/28px var(--font);
  }
  p {
    color: var(--caption);
    font-size: 14px;
    line-height: 20px;
  }
  .card__cta {
    margin-top: auto;
  }
  @media (max-width: 1024px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
