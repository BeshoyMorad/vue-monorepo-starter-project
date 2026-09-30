<script setup lang="ts">
  import { Button, PageWrapper } from '@workspace/ui';
  import { paths } from '~/router/paths';

  const localePath = useLocalePath();
  const { locale, setLocale } = useI18n();

  const currentLocale = computed(() => locale.value);
  const toggleLocale = () => {
    const next = currentLocale.value === 'en' ? 'ar' : 'en';
    setLocale(next);
  };
</script>

<template>
  <div class="bg-bg-surface-default text-text-default flex min-h-screen flex-col font-sans">
    <!-- Website Navigation Header -->
    <header
      class="border-border-base bg-background-surface/80 sticky top-0 z-50 border-b px-6 py-4 backdrop-blur"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink
            :to="localePath(paths.home)"
            class="text-text-primary text-xl font-bold tracking-tight hover:opacity-90"
          >
            @workspace/website
          </NuxtLink>

          <nav class="hidden items-center gap-6 text-sm font-medium md:flex">
            <NuxtLink
              :to="localePath(paths.home)"
              class="hover:text-text-primary transition-colors"
              active-class="text-text-primary font-bold"
            >
              {{ $t('nav.home') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath(paths.dashboard)"
              class="hover:text-text-primary transition-colors"
              active-class="text-text-primary font-bold"
            >
              {{ $t('nav.tanstackQuery') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath(paths.ssgExample)"
              class="hover:text-text-primary transition-colors"
              active-class="text-text-primary font-bold"
            >
              {{ $t('nav.ssgExample') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath(paths.isrExample)"
              class="hover:text-text-primary transition-colors"
              active-class="text-text-primary font-bold"
            >
              {{ $t('nav.isrExample') }}
            </NuxtLink>
          </nav>
        </div>

        <div class="flex items-center gap-3">
          <Button
            test-id=""
            type="button"
            class="border-border-base hover:bg-bg-hovered inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors"
            @click="toggleLocale"
          >
            <span>🌐</span>
            <span>{{ currentLocale === 'en' ? 'العربية' : 'English' }}</span>
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content Wrapped in PageWrapper primitive -->
    <main class="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
      <PageWrapper transparent>
        <slot />
      </PageWrapper>
    </main>

    <!-- Website Global Footer -->
    <footer
      class="border-border-base bg-background-surface text-text-caption border-t px-6 py-6 text-center text-sm"
    >
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span>&copy; 2026 Workspace Monorepo. All rights reserved.</span>
        <span class="text-text-disabled text-xs"
          >Nuxt 3 + TanStack Query + Tailwind v4 + Pinia</span
        >
      </div>
    </footer>
  </div>
</template>
