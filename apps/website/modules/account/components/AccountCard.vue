<script setup lang="ts">
  /** A titled section of the account page. Point aria-labelledby at its heading. */
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
    <slot />
  </section>
</template>

<style scoped>
  .acard {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    border: 0.5px solid var(--border);
    border-radius: var(--radius);
    background: #fff;
  }
  .acard--danger {
    border-color: oklch(0.88 0.06 25);
  }
  .acard__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }
  .acard__title {
    color: var(--primary);
    font: 700 18px/28px var(--font);
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
  @media (max-width: 640px) {
    .acard {
      padding: 18px 16px;
    }
  }
</style>
