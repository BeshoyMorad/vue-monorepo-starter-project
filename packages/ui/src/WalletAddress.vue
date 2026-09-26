<script setup lang="ts">
  import CopyText from './CopyText.vue';

  defineProps<{
    address?: string;
  }>();
</script>

<template>
  <CopyText v-if="address" :text="address" />
  <span v-else class="text-text-secondary">-</span>
</template>
