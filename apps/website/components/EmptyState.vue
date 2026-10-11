<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';

  /**
   * Branded empty state: the camel mark in a soft green well, circled by a slow dashed orbit,
   * with a small badge naming what's missing (e.g. a chart icon), a gold flourish under the
   * title and an optional line of explanation. Actions (buttons, links) go in the default slot.
   *
   *   <EmptyState icon="hugeicons--pie-chart" :title="…" :description="…" />
   */
  withDefaults(
    defineProps<{
      title: string;
      description?: string;
      /** Hugeicons class for the badge, e.g. `hugeicons--pie-chart` */
      icon?: string;
    }>(),
    { description: undefined, icon: 'hugeicons--inbox' }
  );
</script>

<template>
  <div class="empty" role="status">
    <div class="empty__wash" aria-hidden="true" />

    <div class="empty__art" aria-hidden="true">
      <span class="empty__halo" />
      <span class="empty__orbit" />
      <div class="empty__well">
        <span class="empty__dune" />
        <IbbilMark class="empty__mark" />
      </div>
      <span class="empty__badge"><Icon :icon="icon" class="size-[18px]" /></span>
      <span class="empty__dot empty__dot--1" />
      <span class="empty__dot empty__dot--2" />
      <span class="empty__dot empty__dot--3" />
    </div>

    <h3 class="empty__title">{{ title }}</h3>
    <div class="empty__flourish" aria-hidden="true"><span /><i /><span /></div>
    <p v-if="description" class="empty__text">{{ description }}</p>

    <div v-if="$slots.default" class="empty__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .empty {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 16px 32px;
    overflow: hidden;
    text-align: center;
  }

  /* Soft green-to-gold glow behind the composition */
  .empty__wash {
    position: absolute;
    inset-inline: 0;
    top: 8px;
    width: 240px;
    height: 240px;
    margin-inline: auto;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgb(45 83 61 / 0.06) 0%,
      rgb(212 160 68 / 0.05) 45%,
      transparent 70%
    );
    pointer-events: none;
  }

  .empty__art {
    position: relative;
    margin: 24px 0 28px;
  }
  .empty__halo,
  .empty__orbit {
    position: absolute;
    border-radius: 50%;
  }
  .empty__halo {
    inset: -36px;
    border: 1px solid rgb(45 83 61 / 0.06);
  }
  .empty__orbit {
    inset: -18px;
    border: 1px dashed rgb(45 83 61 / 0.16);
    animation: empty-orbit 40s linear infinite;
  }

  /* The camel mark in a soft green well, with a gold dune line at its foot */
  .empty__well {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: linear-gradient(
      to bottom,
      rgb(45 83 61 / 0.1),
      rgb(45 83 61 / 0.05),
      rgb(212 160 68 / 0.07)
    );
    box-shadow:
      inset 0 0 0 1px rgb(45 83 61 / 0.1),
      0 14px 34px -16px rgb(45 83 61 / 0.4);
  }
  .empty__dune {
    position: absolute;
    inset-inline: 14px;
    bottom: 18px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgb(212 160 68 / 0.45), transparent);
  }
  .empty__mark {
    width: auto;
    height: 40px;
    color: var(--color-primary-500);
    transform-origin: 50% 100%;
    animation: empty-breathe 4.5s ease-in-out infinite;
  }

  /* What's missing, overlapping the well's lower corner (the end side, in both directions) */
  .empty__badge {
    position: absolute;
    bottom: -6px;
    inset-inline-end: -6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff;
    color: var(--color-gold-600);
    box-shadow:
      inset 0 0 0 1px rgb(45 83 61 / 0.1),
      0 8px 20px -8px rgb(45 83 61 / 0.45);
    animation: empty-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s both;
  }

  .empty__dot {
    position: absolute;
    border-radius: 50%;
    animation: empty-float 3.4s ease-in-out infinite;
  }
  .empty__dot--1 {
    top: -10px;
    inset-inline-start: 4px;
    width: 8px;
    height: 8px;
    background: rgb(212 160 68 / 0.7);
  }
  .empty__dot--2 {
    top: 24px;
    inset-inline-start: -18px;
    width: 6px;
    height: 6px;
    background: rgb(45 83 61 / 0.25);
    animation-delay: 0.9s;
    animation-duration: 4s;
  }
  .empty__dot--3 {
    top: -16px;
    inset-inline-end: 20px;
    width: 4px;
    height: 4px;
    background: rgb(212 160 68 / 0.45);
    animation-delay: 1.7s;
    animation-duration: 4.6s;
  }

  .empty__title {
    position: relative;
    color: var(--color-primary-700);
    font: 700 17px/26px var(--font, var(--font-brand));
  }
  /* Gold flourish: two fading hairlines around a dot */
  .empty__flourish {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
  }
  .empty__flourish span {
    width: 24px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgb(212 160 68 / 0.6));
  }
  .empty__flourish span:last-child {
    transform: scaleX(-1);
  }
  .empty__flourish i {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgb(212 160 68 / 0.8);
  }
  .empty__text {
    position: relative;
    max-width: 24rem;
    margin-top: 12px;
    color: var(--caption, #4b5563);
    font-size: 14px;
    line-height: 22px;
  }
  .empty__actions {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
  }

  /* Entrance: art, title, text and actions rise in one after another */
  .empty__art,
  .empty__title,
  .empty__flourish,
  .empty__text,
  .empty__actions {
    animation: empty-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .empty__title,
  .empty__flourish {
    animation-delay: 80ms;
  }
  .empty__text {
    animation-delay: 150ms;
  }
  .empty__actions {
    animation-delay: 230ms;
  }

  @keyframes empty-rise {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
  }
  @keyframes empty-breathe {
    50% {
      transform: scale(1.04) translateY(-1px);
    }
  }
  @keyframes empty-pop {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
  }
  @keyframes empty-orbit {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes empty-float {
    50% {
      transform: translateY(-5px);
      opacity: 0.45;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .empty *,
    .empty__art {
      animation: none;
    }
  }
</style>
