<script setup lang="ts">
  import { definePageMeta } from '#imports';
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.composablesPaths.root,
    redirect: { name: paths.composablesPaths.overview },
    middleware: 'auth',
    title: 'Composables',
    sidebar: true,
    icon: 'hugeicons--puzzle',
    order: 4,
  });
</script>

<template>
  <NuxtPage />
</template>
