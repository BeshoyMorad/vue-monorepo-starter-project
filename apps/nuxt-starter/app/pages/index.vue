<script setup lang="ts">
  import { paths } from '@/constants/route-names';
  import DocumentationOverview from '@/features/doc/documentation/components/DocumentationOverview.vue';

  definePageMeta({
    name: paths.dashboard.root,
    title: 'Dashboard',
  });
</script>

<template>
  <DocumentationOverview />
</template>
