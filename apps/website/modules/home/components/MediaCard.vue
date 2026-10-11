<script setup lang="ts">
  import { Button, Icon } from '@workspace/ui';

  /**
   * Compact media center card (Figma: news card): cover, date + views or duration, title and a
   * link. Used for news stories and for gallery photos and videos.
   */
  const props = defineProps<{
    title: string;
    /** ISO date and its display text */
    date: string;
    dateText: string;
    href: string;
    linkLabel: string;
    /** Cover image URL; a placeholder shows when missing */
    cover?: string | null;
    /** Shows a play badge on the cover */
    video?: boolean;
    /** Visible count and its full spoken text ("12 views") */
    views?: { text: string; label: string };
    /** Visible duration ("4:41") and its spoken text */
    duration?: { text: string; label: string };
    /** Opens the link in a new tab (gallery media files) */
    external?: boolean;
    testId: string;
  }>();

  const target = computed(() => (props.external ? '_blank' : undefined));
  const rel = computed(() => (props.external ? 'noopener' : undefined));
</script>

<template>
  <article class="media-card">
    <div class="media-card__cover" :class="{ ph: !cover }">
      <NuxtImg
        v-if="cover"
        :src="cover"
        alt=""
        class="media-card__img"
        width="144"
        height="144"
        densities="x1 x2"
        fit="cover"
        format="webp"
        loading="lazy"
      />
      <span v-if="video" class="media-card__play" aria-hidden="true">
        <Icon icon="hugeicons--play" class="size-5" />
      </span>
    </div>
    <div class="media-card__body">
      <div class="media-card__meta">
        <span>
          <Icon icon="hugeicons--calendar-03" class="size-4" />
          <time :datetime="date">{{ dateText }}</time>
        </span>
        <span v-if="duration">
          <Icon icon="hugeicons--clock-01" class="size-4" />
          <span aria-hidden="true">{{ duration.text }}</span>
          <span class="sr-only">{{ duration.label }}</span>
        </span>
        <span v-else-if="views">
          <Icon icon="hugeicons--view" class="size-4" />
          <span aria-hidden="true">{{ views.text }}</span>
          <span class="sr-only">{{ views.label }}</span>
        </span>
      </div>
      <h3>{{ title }}</h3>
      <Button
        as="a"
        class="btn btn--tertiary media-card__more"
        :href="href"
        :target="target"
        :rel="rel"
        :test-id="testId"
      >
        {{ linkLabel }}
        <span class="sr-only">: {{ title }}</span>
        <Icon icon="hugeicons--arrow-right-02" class="site-arrow rtl:rotate-180" />
      </Button>
    </div>
  </article>
</template>

<style scoped>
  .media-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    background: var(--modal2);
  }
  .media-card__cover {
    position: relative;
    flex: none;
    width: 144px;
    height: 144px;
    overflow: hidden;
    border-radius: 8px;
  }
  .media-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .media-card__play {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgb(3 40 29 / 0.6);
    color: #fff;
  }
  .media-card__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .media-card__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: var(--caption);
    font-size: 12px;
    line-height: 16px;
  }
  .media-card__meta > span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  h3 {
    color: var(--primary);
    font: 700 16px/24px var(--font);
    overflow-wrap: anywhere;
  }
  .media-card__more {
    min-height: 36px;
    padding-inline: 0 8px;
  }
  .media-card__more:hover {
    padding-inline-start: 8px;
  }
  /* Phone: cover moves to the end of the card */
  @media (max-width: 560px) {
    .media-card {
      flex-direction: row-reverse;
      gap: 12px;
      padding: 12px;
    }
    .media-card__cover {
      width: 96px;
      height: 96px;
    }
  }
</style>
