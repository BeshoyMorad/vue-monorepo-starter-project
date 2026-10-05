<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import { categories } from '~/modules/home/data';

  const { t } = useI18n();
</script>

<template>
  <section class="section" aria-labelledby="categories-title">
    <SectionHeading
      id="categories-title"
      :eyebrow="t('home.categories.eyebrow')"
      :title="t('home.categories.title')"
      :text="t('home.categories.text')"
    />
    <ul class="container grid">
      <li v-for="item in categories" :key="item.id">
        <!-- The whole card is one link, named by its heading -->
        <a class="card" href="#">
          <span class="card__img"
            ><span class="card__icon"><Icon :icon="item.icon" class="size-16" /></span
          ></span>
          <span class="card__body">
            <h3>{{ t(`home.categories.items.${item.id}`) }}</h3>
            <p>{{ t('home.categories.itemText') }}</p>
          </span>
          <span class="btn btn--chip" aria-hidden="true">
            {{ t('home.categories.browse') }}
            <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
          </span>
        </a>
      </li>
    </ul>
    <a class="btn btn--outline" href="#">
      {{ t('home.categories.all') }}
      <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
    </a>
  </section>
</template>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .card {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px;
    border-radius: var(--radius);
    background: #fff;
    text-align: center;
    filter: drop-shadow(0 5px 10px rgb(0 0 0 / 0.05));
  }
  .card:hover .btn--chip {
    background: var(--color-primary-100);
  }
  .card__img {
    width: 180px;
    height: 180px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgb(230 239 237 / 0.3);
  }
  .card__icon {
    width: 160px;
    height: 160px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--chip);
    color: var(--primary);
  }
  .card__body {
    flex: 1;
  }
  h3 {
    color: var(--primary);
    font: 700 18px/28px var(--font);
  }
  p {
    margin-top: 8px;
    color: var(--muted);
    font-size: 14px;
    line-height: 20px;
  }
  @media (max-width: 1100px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
