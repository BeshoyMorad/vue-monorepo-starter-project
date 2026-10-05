<script setup lang="ts">
  /**
   * Public site pages (home and the marketplace pages to come): header, content, footer.
   * Usage: definePageMeta({ layout: 'site' })
   */
  const { t } = useI18n();

  // Ibbil's design is light-only (the shared tokens use light-dark()), as in the auth layout
  useHead({
    htmlAttrs: { style: 'color-scheme: light' },
    bodyAttrs: { class: 'font-brand' },
    link: [
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/expo-arabic.woff2',
        crossorigin: '',
      },
    ],
  });
</script>

<template>
  <div class="site-ui flex min-h-screen flex-col">
    <a
      href="#main"
      class="bg-primary-500 sr-only z-50 rounded-lg text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:px-4 focus:py-2.5"
    >
      {{ t('home.header.skipToContent') }}
    </a>
    <AppHeader />
    <main id="main" tabindex="-1" class="flex-1 outline-none">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
