<script setup lang="ts">
  import { useDarkTheme, useNetwork } from '@workspace/core/composables';
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
