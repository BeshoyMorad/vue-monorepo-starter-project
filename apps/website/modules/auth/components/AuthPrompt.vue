<script setup lang="ts">
  import type { RouteLocationRaw } from 'vue-router';

  /**
   * Grey footer box such as "Don't have an account? Create Account" or "Back to sign in".
   * The whole box is the link, so it can be clicked or tapped anywhere, not just on the text.
   */
  defineProps<{ text?: string; linkText: string; to: RouteLocationRaw; testId: string }>();
</script>

<template>
  <NuxtLink
    :to="to"
    :data-test-id="testId"
    class="group focus-visible:outline-primary-500 block rounded-2xl bg-[#f4f6f3] px-4 py-3.5 text-center text-sm text-[oklch(0.45_0_0)] transition-colors hover:bg-[#e9eee7] focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-[#e1e8de]"
  >
    <template v-if="text">{{ text }}&nbsp;</template>
    <span class="text-primary-500 font-bold group-hover:underline"> <slot />{{ linkText }} </span>
  </NuxtLink>
</template>
