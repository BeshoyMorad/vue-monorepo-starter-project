<script setup lang="ts">
  // The toast container only matters after the user does something: load it after the page
  // instead of in the entry bundle (it rendered client-only already)
  const Toaster = defineAsyncComponent(() =>
    import('@workspace/ui/ui/sonner').then((module) => module.Toaster)
  );

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
