<script setup lang="ts">
  import { definePageMeta } from '#imports';
  import { paths } from '@/constants/route-names';
  import DocumentationOverview from '@/features/doc/documentation/components/DocumentationOverview.vue';

  definePageMeta({
    name: paths.documentationPaths.overview,
  });
</script>

<template>
  <DocumentationOverview />
</template>
