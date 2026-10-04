<script setup lang="ts">
  import { Icon } from '@workspace/ui';

  /** Square tile with an icon, used in auth card headers. */
  defineProps<{ icon: string }>();
</script>

<template>
  <span
    class="bg-sand-100 text-primary-500 inline-flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
  >
    <Icon :icon="icon" class="size-6" />
  </span>
</template>
