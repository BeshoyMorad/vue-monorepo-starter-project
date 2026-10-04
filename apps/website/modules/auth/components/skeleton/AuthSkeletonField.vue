<script setup lang="ts">
  import AuthSkeletonBlock from './AuthSkeletonBlock.vue';

  /** Placeholder for a labelled input, sized like the real auth fields (46px, 16px radius). */
  withDefaults(defineProps<{ phone?: boolean; hint?: boolean; label?: string }>(), {
    phone: false,
    hint: false,
    label: 'w-28',
  });
</script>

<template>
  <div class="grid gap-1.5">
    <AuthSkeletonBlock class="h-4" :class="label" />
    <!-- Left-to-right like the real phone field: the +966 box stays on the left in Arabic -->
    <div class="flex gap-2" :dir="phone ? 'ltr' : undefined">
      <AuthSkeletonBlock v-if="phone" class="h-[46px] w-[89px] shrink-0 rounded-2xl" />
      <AuthSkeletonBlock class="h-[46px] flex-1 rounded-2xl" />
    </div>
    <AuthSkeletonBlock v-if="hint" class="h-3 w-56 max-w-full" />
  </div>
</template>
