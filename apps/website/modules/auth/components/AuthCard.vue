<script setup lang="ts">
  /** White card that holds an auth form. `accent` adds the green-to-gold top border. */
  withDefaults(defineProps<{ accent?: boolean; wide?: boolean }>(), {
    accent: false,
    wide: false,
  });
</script>

<template>
  <section
    class="border-primary-500/10 relative w-full overflow-hidden rounded-[21.6px] border bg-white shadow-[0_28px_80px_-32px_rgb(31_58_43/0.45)]"
    :class="wide ? 'max-w-3xl' : 'max-w-[424px]'"
  >
    <div
      v-if="accent"
      class="from-primary-500 via-gold-500 to-gold-400 absolute inset-x-0 top-0 h-1 bg-linear-to-r"
    />
    <slot />
  </section>
</template>
