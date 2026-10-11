<script setup lang="ts">
  import { Icon } from '@workspace/ui';

  /**
   * Feature card (Figma: Feature Card): 48px illustration, title, short text, on a white to
   * pale-green gradient. Fills its container, so cards in a row share one height.
   * Pass `image` for the exported illustration; until then `icon` draws a stand-in.
   */
  defineProps<{
    title: string;
    text: string;
    image?: string;
    icon?: string;
  }>();
</script>

<template>
  <article class="feature-card">
    <NuxtImg
      v-if="image"
      :src="image"
      alt=""
      class="feature-card__illustration"
      width="48"
      height="48"
      densities="x1 x2"
      format="webp"
      loading="lazy"
    />
    <span v-else-if="icon" class="feature-card__illustration feature-card__icon">
      <Icon :icon="icon" class="size-7" />
    </span>
    <h3 class="feature-card__title">{{ title }}</h3>
    <p class="feature-card__text">{{ text }}</p>
  </article>
</template>

<style scoped>
  .feature-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    height: 100%;
    padding: 20px;
    border: 0.5px solid #d1d5db;
    border-radius: 8px;
    background: linear-gradient(#fff, var(--chip));
  }
  .feature-card__illustration {
    flex: none;
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
  .feature-card__icon {
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: #fff;
    color: var(--primary);
  }
  .feature-card__title,
  .feature-card__text {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    overflow-wrap: anywhere;
  }
  .feature-card__title {
    color: var(--primary);
    font-weight: 700;
  }
  .feature-card__text {
    color: var(--caption);
  }
</style>
