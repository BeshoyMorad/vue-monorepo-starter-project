<script setup lang="ts">
  import AuthSkeletonBlock from './AuthSkeletonBlock.vue';

  /** Placeholder for AuthCardHeader: step progress, icon tile beside the title, subtitle. */
  withDefaults(defineProps<{ steps?: number; subtitleLines?: number }>(), {
    steps: 0,
    subtitleLines: 1,
  });
</script>

<template>
  <div class="space-y-5">
    <div v-if="steps" class="space-y-2">
      <div class="flex justify-between">
        <AuthSkeletonBlock class="h-4 w-20" />
        <AuthSkeletonBlock class="h-4 w-24" />
      </div>
      <div class="flex gap-1.5">
        <AuthSkeletonBlock v-for="step in steps" :key="step" class="h-1.5 flex-1 rounded-full" />
      </div>
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-3.5">
        <AuthSkeletonBlock class="size-12 shrink-0 rounded-2xl" />
        <AuthSkeletonBlock class="h-8 w-56 max-w-full rounded-lg" />
      </div>
      <AuthSkeletonBlock
        v-for="line in subtitleLines"
        :key="line"
        class="h-4"
        :class="line === subtitleLines ? 'w-2/3' : 'w-full'"
      />
    </div>
  </div>
</template>
