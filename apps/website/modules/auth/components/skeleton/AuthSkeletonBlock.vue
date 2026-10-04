<script setup lang="ts">
  import type { HTMLAttributes } from 'vue';
  import Skeleton from '@workspace/ui/ui/skeleton/Skeleton.vue';
  import { cn } from '@workspace/core/utils';

  /** One placeholder shape: a faint brand-green tint that pulses (still with reduced motion). */
  const props = defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
  <Skeleton :class="cn('bg-primary-500/[0.07] motion-reduce:animate-none', props.class)" />
</template>
