<script setup lang="ts">
  import { Button, Icon } from '@workspace/ui';
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
          <span class="card__media">
            <NuxtImg
              :src="item.image"
              alt=""
              class="card__img"
              width="170"
              height="170"
              densities="x1 x2"
              :quality="75"
              format="webp"
              loading="lazy"
            />
          </span>
          <span class="card__body">
            <h3>{{ t(`home.categories.items.${item.id}.title`) }}</h3>
            <p>{{ t(`home.categories.items.${item.id}.text`) }}</p>
          </span>
          <Button as="span" class="btn card__browse" aria-hidden="true" test-id="category-browse">
            {{ t('home.categories.browse') }}
            <Icon
              icon="hugeicons--arrow-right-01"
              class="site-arrow card__chevron rtl:rotate-180"
            />
          </Button>
        </a>
      </li>
    </ul>
    <Button as="a" class="btn categories__all" href="#" test-id="categories-all">
      {{ t('home.categories.all') }}
      <Icon icon="hugeicons--arrow-right-01" class="site-arrow card__chevron rtl:rotate-180" />
    </Button>
  </section>
</template>

<style scoped>
  /* Figma: 4 columns of up to 293px, then 3, 2 and 1 as the screen narrows */
  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 293px));
    justify-content: center;
    gap: 20px;
  }
  .card {
    height: 100%;
    min-height: 376px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 5px 20px rgb(0 0 0 / 0.05);
    text-align: center;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgb(0 0 0 / 0.08);
  }
  .card:hover .card__browse {
    background: var(--chip);
  }
  .card__media {
    width: 180px;
    height: 180px;
    flex: none;
    display: grid;
    place-items: center;
    overflow: hidden;
    border-radius: 50%;
    background: rgb(230 239 237 / 0.3);
  }
  .card__img {
    width: 170px;
    height: 170px;
    object-fit: cover;
    border-radius: 50%;
  }
  .card__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  h3 {
    color: var(--primary);
    font: 700 18px/28px var(--font);
  }
  p {
    max-width: 244px;
    color: var(--muted);
    font-size: 14px;
    line-height: 20px;
  }
  .card__browse {
    min-height: 36px;
    padding: 8px;
    background: #f3f4f6;
    color: var(--primary);
  }
  .card__chevron {
    width: 20px;
    height: 20px;
  }
  .categories__all {
    gap: 10px;
    padding: 8px 12px;
    border: 0.5px solid #9ca3af;
    background: #fff;
    color: var(--primary);
    font: 700 16px/24px var(--font);
  }
  .categories__all:hover {
    background: var(--color-primary-50);
  }
  @media (prefers-reduced-motion: reduce) {
    .card,
    .card:hover {
      transition: none;
      transform: none;
    }
  }
  @media (max-width: 1200px) {
    .grid {
      grid-template-columns: repeat(3, minmax(0, 293px));
    }
  }
  @media (max-width: 960px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 293px));
    }
  }
  /* Phone: compact 2-column tiles. The whole tile is the link, so the text and the browse
     chip are dropped to keep seven categories from becoming a long scroll. */
  @media (max-width: 600px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .card {
      min-height: 0;
      gap: 12px;
      padding: 16px 12px;
    }
    .card__media {
      width: 104px;
      height: 104px;
    }
    .card__img {
      width: 98px;
      height: 98px;
    }
    h3 {
      font-size: 15px;
      line-height: 22px;
    }
    p,
    .card__browse {
      display: none;
    }
  }
</style>
