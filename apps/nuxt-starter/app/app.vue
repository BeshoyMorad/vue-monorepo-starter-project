<script setup lang="ts">
  import { useHead, useRoute } from '#imports';
  import { useAppLocale, useDarkTheme, useNetwork } from '@/composables';
  import { ErrorBoundary, Toaster } from '@/components';

  const route = useRoute();
  const { currentLocale, currentLocaleMeta } = useAppLocale();

  useHead(() => ({
    title: route.meta.title,
    htmlAttrs: {
      lang: currentLocale.value,
      dir: currentLocaleMeta.value.direction,
    },
  }));

  useDarkTheme();

  const { initListeners } = useNetwork();
  initListeners();
</script>

<template>
  <ErrorBoundary>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ErrorBoundary>

  <Toaster />
</template>
