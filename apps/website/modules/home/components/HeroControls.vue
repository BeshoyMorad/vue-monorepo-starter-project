<script setup lang="ts">
  import { Button } from '@workspace/ui';

  /**
   * Hero pagination, matching the design: 8px white dots, the current one a 24px gold pill.
   * The play/pause button (WCAG 2.2.2) stays out of sight until keyboard focus reaches it.
   */
  defineProps<{ index: number; total: number; playing: boolean }>();
  const emit = defineEmits<{ go: [n: number]; toggle: [] }>();
  const { t } = useI18n();
</script>

<template>
  <div class="pager">
    <Button
      type="button"
      class="pager__play ui-bare"
      test-id="hero-play"
      :aria-label="playing ? t('home.hero.pause') : t('home.hero.play')"
      :icon="playing ? 'hugeicons--pause' : 'hugeicons--play'"
      @click="emit('toggle')"
    />
    <Button
      v-for="(_, n) in total"
      :key="n"
      type="button"
      class="dot ui-bare"
      :test-id="`hero-dot-${n + 1}`"
      :aria-label="t('home.hero.goTo', { n: n + 1 })"
      :aria-current="n === index ? 'true' : undefined"
      @click="emit('go', n)"
    />
  </div>
</template>

<style scoped>
  .pager {
    position: absolute;
    bottom: 4px;
    left: 50%;
    display: flex;
    align-items: center;
    gap: 4px;
    transform: translateX(-50%);
  }
  /* Visible dot is 8px; the button is 24px tall so it stays easy to hit */
  .dot {
    position: relative;
    width: 8px;
    height: 24px;
    cursor: pointer;
    transition: width 250ms ease;
  }
  .dot::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    top: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgb(255 255 255 / 0.6);
    transition: background 250ms ease;
  }
  .dot[aria-current='true'] {
    width: 24px;
  }
  .dot[aria-current='true']::before {
    background: var(--secondary);
  }
  .dot:hover:not([aria-current='true'])::before {
    background: #fff;
  }
  /* Hidden until a keyboard user tabs to it, then it shows beside the dots */
  .pager__play {
    position: absolute;
    inset-inline-end: calc(100% + 8px);
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    border-radius: 99px;
    background: var(--glass);
    color: #fff;
    opacity: 0;
    pointer-events: none;
  }
  .pager__play:focus-visible {
    opacity: 1;
    pointer-events: auto;
  }
  @media (prefers-reduced-motion: reduce) {
    .dot,
    .dot::before {
      transition: none;
    }
  }
</style>
