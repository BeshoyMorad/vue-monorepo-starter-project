<script setup lang="ts">
  import { DirectionProvider } from '@workspace/ui/ui/direction';

  // The toast container only matters after the user does something: load it after the page
  // instead of in the entry bundle (it rendered client-only already)
  const Toaster = defineAsyncComponent(() =>
    import('@workspace/ui/ui/sonner').then((module) => module.Toaster)
  );

  useHtmlAttrs();

  // reka-ui menus and dialogs render outside the page: give them the locale's direction too
  const { localeProperties } = useI18n();
  const dir = computed(() => (localeProperties.value.dir === 'rtl' ? 'rtl' : 'ltr'));
</script>

<template>
  <DirectionProvider :dir="dir">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <Toaster />
    </ClientOnly>
  </DirectionProvider>
</template>
