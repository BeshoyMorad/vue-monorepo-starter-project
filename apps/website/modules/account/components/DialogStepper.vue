<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';

  /**
   * Numbered steps of a dialog (change password, wallet PIN): done steps get a tick, the
   * current one is filled green with a soft halo and marked aria-current="step".
   */
  defineProps<{ steps: string[]; current: number }>();
</script>

<template>
  <ol class="stepper" :style="{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }">
    <li
      v-for="(name, index) in steps"
      :key="name"
      class="stepper__item"
      :class="{ 'stepper__item--on': index === current, 'stepper__item--done': index < current }"
      :aria-current="index === current ? 'step' : undefined"
    >
      <span class="stepper__dot">
        <Icon v-if="index < current" icon="hugeicons--tick-02" class="size-3.5" />
        <template v-else>{{ index + 1 }}</template>
      </span>
      <span class="stepper__label">{{ name }}</span>
    </li>
  </ol>
</template>
<style scoped>
  .stepper {
    display: grid;
    margin-bottom: 20px;
  }
  .stepper__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: oklch(0.45 0 0);
    font: 500 12px/16px var(--font);
  }
  /* Connector to the next step */
  .stepper__item:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 14px;
    inset-inline-start: calc(50% + 20px);
    width: calc(100% - 40px);
    height: 1px;
    background: #e5e7eb;
  }
  .stepper__item--done:not(:last-child)::after {
    background: var(--color-primary-300);
  }
  .stepper__item::after,
  .stepper__dot {
    transition:
      background-color 300ms,
      border-color 300ms,
      box-shadow 300ms,
      color 300ms;
  }
  .stepper__dot {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border: 1px solid #e5e7eb;
    border-radius: 50%;
    background: #f3f4f6;
    font-weight: 600;
  }
  .stepper__item--on {
    color: var(--color-primary-500);
    font-weight: 600;
  }
  .stepper__item--on .stepper__dot {
    border-color: var(--color-primary-500);
    background: var(--color-primary-500);
    box-shadow: 0 0 0 3px var(--color-primary-100);
    color: #fff;
  }
  .stepper__item--done .stepper__dot {
    border-color: var(--color-primary-300);
    background: var(--color-primary-50);
    color: var(--color-primary-500);
  }
</style>
