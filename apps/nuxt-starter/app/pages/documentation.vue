<script setup lang="ts">
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.documentationPaths.root,
    redirect: { name: paths.documentationPaths.overview },
    title: 'Documentation',
    sidebar: true,
    icon: 'hugeicons--document-code',
    order: 1,
  });
</script>

<template>
  <NuxtPage />
</template>
