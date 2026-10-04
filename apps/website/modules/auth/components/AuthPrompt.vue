<script setup lang="ts">
  import type { RouteLocationRaw } from 'vue-router';

  /** Grey footer box such as "Don't have an account? Create Account". */
  defineProps<{ text?: string; linkText: string; to: RouteLocationRaw; testId: string }>();
</script>

<template>
  <p class="rounded-2xl bg-[#f4f6f3] px-4 py-3.5 text-center text-sm text-[oklch(0.45_0_0)]">
    <template v-if="text">{{ text }}&nbsp;</template>
    <NuxtLink :to="to" :data-test-id="testId" class="text-primary-500 font-bold hover:underline">
      <slot />{{ linkText }}
    </NuxtLink>
  </p>
</template>
