<script setup lang="ts">
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.componentsPaths.root,
    redirect: { name: paths.componentsPaths.overview },
    title: 'Components',
    sidebar: true,
    icon: 'hugeicons--block-game',
    order: 2,
  });
</script>

<template>
  <NuxtPage />
</template>
