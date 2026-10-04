<script setup lang="ts">
  import AuthIconTile from './AuthIconTile.vue';
  import AuthStepBadge from './AuthStepBadge.vue';

  /**
   * Top of an auth card: the step progress (for multi-step flows), then the icon beside the
   * title. The default slot is the subtitle, shown full width under them.
   */
  defineProps<{
    icon: string;
    title: string;
    step?: { current: number; total: number; label?: string };
  }>();
</script>

<template>
  <div class="space-y-5">
    <AuthStepBadge v-if="step" v-bind="step" />
    <div class="space-y-2">
      <div class="flex items-center gap-3.5">
        <AuthIconTile :icon="icon" />
        <h1
          class="icon-label text-primary-500 text-[26.4px] leading-[33px] font-extrabold tracking-[-0.66px]"
        >
          {{ title }}
        </h1>
      </div>
      <div v-if="$slots.default" class="space-y-1 text-[oklch(0.45_0_0)]">
        <slot />
      </div>
    </div>
  </div>
</template>
