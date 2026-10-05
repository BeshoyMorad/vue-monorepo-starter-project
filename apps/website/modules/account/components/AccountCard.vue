<script setup lang="ts">
  /** A titled card of the profile pages (title row with a divider, then the content) */
  defineProps<{ id: string; title: string; text?: string; tone?: 'default' | 'danger' }>();
</script>

<template>
  <section class="acard" :class="{ 'acard--danger': tone === 'danger' }" :aria-labelledby="id">
    <header class="acard__head">
      <div>
        <h2 :id="id" class="acard__title">{{ title }}</h2>
        <p v-if="text" class="acard__text">{{ text }}</p>
      </div>
      <slot name="action" />
    </header>
    <div class="acard__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
  .acard {
    overflow: hidden;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }
  .acard--danger {
    box-shadow: 0 0 0 1px oklch(0.9 0.05 25);
  }
  .acard__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid #eef0ef;
  }
  .acard__title {
    color: var(--primary);
    font: 700 20px/28px var(--font);
  }
  .acard--danger .acard__title {
    color: oklch(0.45 0.17 25);
  }
  .acard__text {
    margin-top: 2px;
    color: var(--caption);
    font-size: 14px;
    line-height: 22px;
  }
  .acard__body {
    padding: 24px;
  }
  @media (max-width: 640px) {
    .acard__head,
    .acard__body {
      padding-inline: 16px;
    }
  }
</style>
