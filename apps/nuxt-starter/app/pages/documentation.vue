<script setup lang="ts">
  import { definePageMeta } from '#imports';
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.documentationPaths.root,
    redirect: { name: paths.documentationPaths.overview },
    middleware: 'auth',
    title: 'Documentation',
    sidebar: true,
    icon: 'hugeicons--document-code',
    order: 1,
  });
</script>

<template>
  <NuxtPage />
</template>
