<script setup lang="ts">
  import { Toaster } from '@workspace/ui';

  useHtmlAttrs();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>
