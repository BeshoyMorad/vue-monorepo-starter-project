<script setup lang="ts">
  import { PageWrapper, StatusBadge } from '@workspace/ui';

  // In nuxt.config.ts, this route has routeRules: { '/isr-example': { isr: 60 } }
  const { data: cacheInfo } = await useAsyncData('isr-cache-data', async () => {
    return {
      strategy: 'Incremental Static Regeneration (ISR / SWR)',
      ttlSeconds: 60,
      serverTimestamp: new Date().toISOString(),
      randomValue: Math.floor(Math.random() * 1000000),
    };
  });
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text-default text-2xl font-bold">Incremental Static Regeneration (ISR)</h1>
        <p class="text-text-caption text-sm">
          Configured in <code>nuxt.config.ts</code> with
          <code>routeRules: { '/isr-example': { isr: 60 } }</code>.
        </p>
      </div>

      <StatusBadge variant="warning" test-id="badge-isr">Cached: 60s TTL</StatusBadge>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <PageWrapper title="Cached Server Response">
        <div class="space-y-4">
          <div class="border-border-base bg-background-surface-2 space-y-2 rounded-lg border p-4">
            <div class="text-text-caption text-xs font-semibold uppercase">
              Server Cache Timestamp
            </div>
            <div class="text-text-primary font-mono text-sm font-bold">
              {{ cacheInfo?.serverTimestamp }}
            </div>
            <div class="text-text-disabled text-xs">
              Token/Seed: <span class="font-mono font-medium">{{ cacheInfo?.randomValue }}</span>
            </div>
          </div>

          <p class="text-text-caption text-xs">
            Requests arriving within the 60s window receive the cached HTML instantly. Once the 60s
            window expires, the next visitor triggers a background revalidation while still getting
            the cached version immediately (stale-while-revalidate).
          </p>
        </div>
      </PageWrapper>

      <PageWrapper title="How ISR Differs from SSR & SSG">
        <div class="text-text-caption space-y-3 text-sm leading-relaxed">
          <p>
            <strong>SSR (Dynamic):</strong> Server renders on <em>every single</em> request. Great
            for user-specific real-time data, but adds server compute and latency.
          </p>
          <p>
            <strong>SSG (Static):</strong> HTML generated once at <em>build time</em>. Unbeatable
            speed, but requires redeploying the site to update content.
          </p>
          <p>
            <strong>ISR (Best of Both):</strong> Static speed from the cache + automatic background
            refreshes on a timed interval without redeploying.
          </p>
        </div>
      </PageWrapper>
    </div>
  </div>
</template>
