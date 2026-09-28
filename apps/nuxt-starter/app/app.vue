<script setup lang="ts">
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

  <Sonner />
</template>
