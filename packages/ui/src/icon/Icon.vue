<script setup lang="ts">
  import type { HtmlHTMLAttributes } from 'vue';
  import { cn } from '@workspace/core/utils';
  import { iconVariants, type IconVariants } from './variants';

  interface Props {
    testId?: string;
    icon: HtmlHTMLAttributes['class'];
    colored?: IconVariants['colored'];
    size?: IconVariants['size'];
  }

  const props = withDefaults(defineProps<Props>(), {
    testId: 'ui-icon',
    colored: undefined,
    size: undefined,
  });
</script>

<template>
  <span :data-test-id="props.testId" :class="cn([iconVariants({ colored, size }), icon])" />
</template>
