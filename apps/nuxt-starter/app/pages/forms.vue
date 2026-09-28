<script setup lang="ts">
  import { paths } from '@/constants/route-names';

  definePageMeta({
    name: paths.formsPaths.root,
    redirect: { name: paths.formsPaths.overview },
    title: 'Forms',
    sidebar: true,
    icon: 'hugeicons--input-short-text',
    order: 3,
  });
</script>

<template>
  <NuxtPage />
</template>
