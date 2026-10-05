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
      <li v-for="item in services" :key="item.id">
        <!-- The whole card is one link, named by its heading and text -->
        <a class="card" href="#">
          <span class="slot">
            <span class="slot__icon"><Icon :icon="item.icon" class="size-12" /></span>
          </span>
          <span class="card__body">
            <h3>{{ t(`home.services.items.${item.id}.title`) }}</h3>
            <p>{{ t(`home.services.items.${item.id}.text`) }}</p>
          </span>
          <span class="btn btn--glass card__cta" aria-hidden="true">
            {{ t('home.services.explore') }}
            <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
          </span>
          <Icon icon="hugeicons--arrow-right-01" class="card__chev size-5 rtl:rotate-180" />
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
    height: 100%;
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
  .card:hover .card__cta {
    background: rgb(45 83 61 / 0.12);
  }
  .card__body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .card__chev {
    display: none;
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
  /* Phone: compact rows, icon | title + text | arrow */
  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .card {
      min-height: 0;
      display: grid;
      grid-template-columns: 56px 1fr 20px;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
    }
    .slot,
    .slot__icon {
      width: 56px;
      height: 56px;
    }
    .slot__icon > span {
      width: 28px;
      height: 28px;
    }
    .card__body {
      gap: 2px;
    }
    h3 {
      font-size: 16px;
      line-height: 24px;
    }
    p {
      font-size: 13px;
      line-height: 20px;
    }
    .card__cta {
      display: none;
    }
    .card__chev {
      display: block;
      color: var(--primary);
    }
  }
</style>
