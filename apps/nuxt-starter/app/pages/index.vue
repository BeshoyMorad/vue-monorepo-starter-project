<script setup lang="ts">
  import { definePageMeta } from '#imports';
  import { paths } from '@/constants/route-names';
  import DocumentationOverview from '@/features/doc/documentation/components/DocumentationOverview.vue';

  definePageMeta({
    name: paths.dashboard.root,
    middleware: 'auth',
    title: 'Dashboard',
  });
</script>

<template>
  <DocumentationOverview />
</template>
