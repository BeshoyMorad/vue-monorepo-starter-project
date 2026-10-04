<script setup lang="ts">
  import {
    USE_DATA_INFINITE_SCROLL_DOM,
    USE_DATA_INFINITE_SCROLL_IMPORT_CODE,
  } from '@/features/doc/composables/useInfinteScroll/constants/constants';
</script>
<template>
  <!-- Import -->
  <ExampleCard
    :title="USE_DATA_INFINITE_SCROLL_DOM.import.title"
    :description="USE_DATA_INFINITE_SCROLL_DOM.import.description"
    :show-preview="false"
    :code="USE_DATA_INFINITE_SCROLL_IMPORT_CODE"
    header="Import"
  />
</template>
