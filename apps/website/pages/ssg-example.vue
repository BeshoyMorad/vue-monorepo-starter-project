<script setup lang="ts">
  import { PageWrapper, StatusBadge } from '@workspace/ui';

  // In nuxt.config.ts, this route has routeRules: { '/ssg-example': { prerender: true } }
  const { data: buildTimeData } = await useAsyncData('ssg-build-time', async () => {
    return {
      strategy: 'Static Site Generation (SSG)',
      generatedAt: new Date().toISOString(),
      advantages: [
        'Pre-rendered directly to static HTML during "nuxt generate" / "nuxt build"',
        'Zero server-side execution required at runtime — serve directly from CDN edge or S3/Blob storage',
        'Instant Time to First Byte (TTFB) and maximum SEO crawlability',
      ],
    };
  });
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text-default text-2xl font-bold">Static Site Generation (SSG)</h1>
        <p class="text-text-caption text-sm">
          Configured in <code>nuxt.config.ts</code> with
          <code>routeRules: { '/ssg-example': { prerender: true } }</code>.
        </p>
      </div>

      <StatusBadge variant="success" test-id="badge-ssg">Prerendered (Static)</StatusBadge>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <PageWrapper title="Build-time Snapshot">
        <div class="space-y-4">
          <div class="border-border-base bg-background-surface-2 space-y-2 rounded-lg border p-4">
            <div class="text-text-caption text-xs font-semibold uppercase">
              Generation Timestamp
            </div>
            <div class="text-text-primary font-mono text-sm font-bold">
              {{ buildTimeData?.generatedAt }}
            </div>
            <p class="text-text-disabled text-xs">
              Notice this timestamp is baked into static HTML at build time and stays fixed across
              refreshes.
            </p>
          </div>
        </div>
      </PageWrapper>

      <PageWrapper title="When to use SSG">
        <ul class="text-text-caption list-inside list-disc space-y-2 text-sm">
          <li v-for="adv in buildTimeData?.advantages" :key="adv">
            {{ adv }}
          </li>
        </ul>
      </PageWrapper>
    </div>
  </div>
</template>
