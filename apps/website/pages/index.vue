<script setup lang="ts">
  import { PageWrapper, StatusBadge, Button, CopyText } from '@workspace/ui';

  // SEO-Critical Data Fetching via Nuxt native useAsyncData / useFetch
  const { data: pageInfo } = await useAsyncData('marketing-hero-data', async () => {
    return {
      version: '1.0.0',
      stats: [
        { label: 'Core Shared Packages', value: '3' },
        { label: 'SPA Apps & Tenants', value: '3' },
        { label: 'SSR Performance', value: '100/100' },
        { label: 'Type Coverage', value: 'Strict' },
      ],
      updatedAt: new Date().toISOString(),
    };
  });

  useSeoMeta({
    title: 'Workspace Website — Nuxt 3 Hybrid Monorepo',
    description:
      'Modern Nuxt 3 application with SSR, SSG, and ISR sharing core packages and design system across a Turborepo + pnpm monorepo.',
    ogTitle: 'Workspace Website — Nuxt 3 Hybrid Monorepo',
    ogDescription:
      'Modern Nuxt 3 application with SSR, SSG, and ISR sharing core packages and design system across a Turborepo + pnpm monorepo.',
  });
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="mx-auto max-w-4xl space-y-6 px-4 py-12 text-center">
      <div class="inline-flex items-center gap-2">
        <StatusBadge variant="primary" test-id="badge-hero">
          {{ $t('website.hero.badge') }}
        </StatusBadge>
      </div>

      <h1 class="text-text-default text-4xl font-extrabold tracking-tight sm:text-5xl">
        {{ $t('website.hero.title') }}
      </h1>

      <p class="text-text-caption mx-auto max-w-2xl text-lg">
        {{ $t('website.hero.subtitle') }}
      </p>

      <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
        <NuxtLink :to="useLocalePath()('/dashboard')">
          <Button test-id="btn-hero-dashboard" size="lg">
            {{ $t('website.hero.ctaDashboard') }} &rarr;
          </Button>
        </NuxtLink>
        <NuxtLink :to="useLocalePath()('/ssg-example')">
          <Button test-id="btn-hero-ssg" outline size="lg">
            {{ $t('nav.ssgExample') }}
          </Button>
        </NuxtLink>
      </div>

      <div class="flex items-center justify-center gap-2 pt-4">
        <span class="text-text-disabled text-xs">Clone starter:</span>
        <CopyText text="git clone https://github.com/example/monorepo.git" />
      </div>
    </section>

    <!-- Key Metrics Grid -->
    <section class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div
        v-for="stat in pageInfo?.stats"
        :key="stat.label"
        class="border-border-base bg-background-surface space-y-2 rounded-xl border p-6 text-center"
      >
        <div class="text-text-primary text-3xl font-bold">{{ stat.value }}</div>
        <div class="text-text-caption text-xs font-medium">{{ stat.label }}</div>
      </div>
    </section>

    <!-- Architecture Features -->
    <section class="space-y-6">
      <div class="space-y-2 text-center">
        <h2 class="text-text-default text-2xl font-bold">{{ $t('website.features.title') }}</h2>
        <p class="text-text-caption text-sm">Built on enterprise best practices</p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <PageWrapper :title="$t('website.features.ssr.title')" test-id="card-ssr">
          <p class="text-text-caption text-sm leading-relaxed">
            {{ $t('website.features.ssr.description') }}
          </p>
        </PageWrapper>

        <PageWrapper :title="$t('website.features.hydration.title')" test-id="card-hydration">
          <p class="text-text-caption text-sm leading-relaxed">
            {{ $t('website.features.hydration.description') }}
          </p>
        </PageWrapper>

        <PageWrapper :title="$t('website.features.permissions.title')" test-id="card-permissions">
          <p class="text-text-caption text-sm leading-relaxed">
            {{ $t('website.features.permissions.description') }}
          </p>
        </PageWrapper>
      </div>
    </section>
  </div>
</template>
