<script setup lang="ts">
  import { useNetwork } from '@workspace/core/composables';
  import { useDarkTheme } from '@/composables/useDarkTheme';
  import { ErrorBoundary, Toaster } from '@workspace/ui';

  useDarkTheme();

  const { initListeners } = useNetwork();
  initListeners();
</script>

<template>
  <ErrorBoundary>
    <RouterView />
  </ErrorBoundary>

  <Toaster />
</template>
