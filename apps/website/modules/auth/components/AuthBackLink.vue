<script setup lang="ts">
  import { Icon } from '@workspace/ui';
  import type { RouteLocationRaw } from 'vue-router';

  /** Gold text link with a back arrow (mirrored in Arabic), e.g. "Change registration details". */
  defineProps<{ to: RouteLocationRaw; testId: string }>();
</script>

<template>
  <div class="text-center">
    <NuxtLink
      :to="to"
      :data-test-id="testId"
      class="text-gold-800 hover:text-gold-900 inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm font-semibold hover:underline"
    >
      <Icon
        icon="hugeicons--arrow-left-02"
        class="auth-back-arrow size-4 shrink-0 rtl:rotate-180"
        aria-hidden="true"
      />
      <span class="icon-label"><slot /></span>
    </NuxtLink>
  </div>
</template>
