<script setup lang="ts">
  /**
   * Section title block of the public site: eyebrow, h2, gold rule, optional intro text.
   * Pass `id` and point the section's aria-labelledby at it to name the section.
   */
  defineProps<{
    id?: string;
    eyebrow: string;
    title: string;
    text?: string;
    align?: 'center' | 'start';
  }>();
</script>

<template>
  <div class="sh" :class="{ 'sh--start': align === 'start' }">
    <p class="sh__eyebrow">{{ eyebrow }}</p>
    <h2 :id="id" class="sh__title">{{ title }}</h2>
    <div class="sh__rule" aria-hidden="true" />
    <p v-if="text" class="sh__text">{{ text }}</p>
  </div>
</template>

<style scoped>
  .sh {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 672px;
    margin-inline: auto;
    text-align: center;
  }
  .sh--start {
    align-items: flex-start;
    max-width: none;
    text-align: start;
  }
  .sh__eyebrow {
    color: var(--secondary-text);
    font: 600 14px/20px var(--font);
  }
  .sh__title {
    color: var(--primary);
    font: 700 30px/36px var(--font);
  }
  .sh__rule {
    position: relative;
    width: 112px;
    height: 12px;
  }
  .sh__rule::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    top: 5.5px;
    height: 1px;
    background: var(--invert);
  }
  .sh__rule::after {
    content: '';
    position: absolute;
    top: 4px;
    inset-inline-start: 36px;
    width: 40px;
    height: 4px;
    border-radius: 99px;
    background: var(--secondary);
  }
  .sh--start .sh__rule::after {
    inset-inline-start: 0;
  }
  .sh__text {
    color: var(--caption);
  }
</style>
