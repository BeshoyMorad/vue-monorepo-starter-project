<script setup lang="ts">
  import { Button, Icon } from '@workspace/ui';
  import { services } from '~/modules/home/data';

  /**
   * "Platform services" (Figma: Services section): six cards with an illustration on a
   * pale-green halo, title, text and an "explore" link. 3 columns, 2 on tablet, 1 on phone.
   */
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
        <a class="card" :href="item.to">
          <span class="card__art">
            <NuxtImg
              :src="item.image"
              alt=""
              class="card__img"
              width="112"
              height="112"
              densities="x1 x2"
              :quality="80"
              format="webp"
              loading="lazy"
            />
          </span>
          <h3>{{ t(`home.services.items.${item.id}.title`) }}</h3>
          <p>{{ t(`home.services.items.${item.id}.text`) }}</p>
          <Button
            as="span"
            class="btn btn--tertiary card__cta"
            aria-hidden="true"
            test-id="service-explore"
          >
            {{ t('home.services.explore') }}
            <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
          </Button>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
  .services {
    padding-block: 40px;
    background: var(--modal2);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
    border-radius: 8px;
    background: #fff;
    transition: box-shadow 0.2s;
  }
  .card:hover {
    box-shadow: 0 5px 20px rgb(0 0 0 / 0.05);
  }
  /* Illustration centered on a 112px pale-green halo */
  .card__art {
    width: 100%;
    height: 136px;
    display: grid;
    place-items: center;
  }
  .card__img {
    width: 112px;
    height: 112px;
    object-fit: cover;
    border-radius: 50%;
    background: var(--chip);
  }
  h3 {
    width: 100%;
    color: var(--primary);
    font: 700 18px/28px var(--font);
  }
  p {
    width: 100%;
    color: var(--caption);
    font-size: 14px;
    line-height: 20px;
  }
  /* Text link look: starts flush with the text, tints when the card is hovered */
  .card__cta {
    margin-top: auto;
    padding-inline: 12px 0;
    margin-inline-start: -12px;
    font-size: 16px;
    line-height: 24px;
  }
  .card:hover .card__cta {
    padding-inline-end: 12px;
    background: var(--chip);
  }
  @media (max-width: 1024px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .card {
      min-height: 0;
    }
  }
</style>
