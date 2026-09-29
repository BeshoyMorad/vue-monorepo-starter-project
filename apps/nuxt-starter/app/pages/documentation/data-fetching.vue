<script setup lang="ts">
  import { paths } from '@/constants/route-names';
  import {
    DATA_FETCHING_COMPARISON,
    DATA_FETCHING_DOM,
    NATIVE_SERVER_ROUTE_CODE,
    NATIVE_USE_ASYNC_DATA_CODE,
    NATIVE_USE_FETCH_CODE,
    TANSTACK_COMPOSABLE_CODE,
    TANSTACK_USAGE_CODE,
  } from '@/features/doc/documentation/data-fetching/constants/constants';
  import {
    SERVER_STATS_REFETCH_INTERVAL,
    useServerStatsQuery,
  } from '@/features/doc/documentation/data-fetching/composables/useServerStatsQuery';

  definePageMeta({
    name: paths.documentationPaths.dataFetching,
    title: 'Data Fetching',
    sidebar: true,
    order: 5,
    // Example of the named permission middleware: users without `admins.list`
    // are redirected to the access-denied page.
    middleware: ['permission'],
    permissions: 'admins.list',
  });

  // ── Native Nuxt fetching ────────────────────────────────────────────────────
  const MAX_ARTICLES = 5;
  const limit = ref(3);

  const {
    data: articles,
    status: articlesStatus,
    error: articlesError,
    refresh: refreshArticles,
  } = await useFetch('/api/examples/articles', {
    key: 'docs-example-articles',
    query: { limit },
  });

  // ── TanStack Query ──────────────────────────────────────────────────────────
  const {
    data: stats,
    isPending: statsPending,
    isFetching: statsFetching,
    isError: statsError,
    dataUpdatedAt,
    refetch: refetchStats,
    suspense: statsSuspense,
  } = useServerStatsQuery();

  // With SSR on, wait for the query during server rendering so its result is dehydrated into
  // the page payload. Does nothing while the app runs with ssr: false.
  onServerPrefetch(statsSuspense);

  const lastUpdated = computed(() =>
    dataUpdatedAt.value ? new Date(dataUpdatedAt.value).toLocaleTimeString() : '-'
  );
</script>

<template>
  <div class="mx-auto w-full space-y-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <section class="space-y-2">
      <h1 class="text-text-primary heading-font text-3xl font-bold tracking-tight">
        {{ DATA_FETCHING_DOM.title }}
      </h1>

      <p class="text-text-secondary max-w-3xl text-sm leading-6">
        {{ DATA_FETCHING_DOM.description }}
      </p>
    </section>

    <!-- Choosing -->
    <ExampleCard
      :title="DATA_FETCHING_DOM.choosing.title"
      :description="DATA_FETCHING_DOM.choosing.description"
      :border="false"
    >
      <template #preview>
        <div class="w-full overflow-x-auto">
          <table class="w-full text-start text-sm">
            <thead class="text-text-secondary">
              <tr>
                <th class="px-3 py-2 text-start font-medium">Tool</th>
                <th class="px-3 py-2 text-start font-medium">Use it for</th>
                <th class="px-3 py-2 text-start font-medium">Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in DATA_FETCHING_COMPARISON"
                :key="row.tool"
                class="border-border-base/50 border-t"
              >
                <td class="text-text-primary px-3 py-2 font-mono text-xs">{{ row.tool }}</td>
                <td class="text-text-secondary px-3 py-2">{{ row.useFor }}</td>
                <td class="text-text-secondary px-3 py-2">{{ row.examples }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </ExampleCard>

    <!-- Native Nuxt fetching -->
    <ExampleCard
      :title="DATA_FETCHING_DOM.native.title"
      :description="DATA_FETCHING_DOM.native.description"
      :how-to-use="DATA_FETCHING_DOM.native.howToUse"
      header="useFetch"
      :code-arr="[
        { code: NATIVE_USE_FETCH_CODE, header: 'useFetch' },
        { code: NATIVE_USE_ASYNC_DATA_CODE, header: 'useAsyncData' },
        { code: NATIVE_SERVER_ROUTE_CODE, header: 'Server route' },
      ]"
    >
      <template #preview>
        <div class="w-full space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <Button
              test-id="data-fetching-fewer"
              size="sm"
              outline
              :disabled="limit <= 1"
              @click="limit--"
            >
              Show fewer
            </Button>
            <Button
              test-id="data-fetching-more"
              size="sm"
              outline
              :disabled="limit >= MAX_ARTICLES"
              @click="limit++"
            >
              Show more
            </Button>
            <Button
              test-id="data-fetching-refresh"
              size="sm"
              :loading="articlesStatus === 'pending'"
              @click="refreshArticles()"
            >
              Refresh
            </Button>
            <span class="text-text-secondary text-xs">status: {{ articlesStatus }}</span>
          </div>

          <ErrorAlert v-if="articlesError">{{ articlesError.message }}</ErrorAlert>

          <ul v-else class="space-y-2">
            <li
              v-for="article in articles?.data"
              :key="article.id"
              class="border-border-base/50 rounded-lg border px-4 py-3"
            >
              <p class="text-text-primary text-sm font-medium">{{ article.title }}</p>
              <p class="text-text-secondary text-xs">{{ article.summary }}</p>
            </li>
          </ul>

          <p v-if="articles" class="text-text-secondary text-xs">
            Showing {{ articles.data.length }} of {{ articles.total }} articles
          </p>
        </div>
      </template>
    </ExampleCard>

    <!-- TanStack Query -->
    <ExampleCard
      :title="DATA_FETCHING_DOM.tanstack.title"
      :description="DATA_FETCHING_DOM.tanstack.description"
      :how-to-use="DATA_FETCHING_DOM.tanstack.howToUse"
      :code-arr="[
        { code: TANSTACK_COMPOSABLE_CODE, header: 'useServerStatsQuery.ts' },
        { code: TANSTACK_USAGE_CODE, header: 'Usage' },
      ]"
    >
      <template #preview>
        <div class="w-full space-y-4">
          <Skeleton v-if="statsPending" class="h-20 w-full" />

          <ErrorAlert v-else-if="statsError">Could not load server stats.</ErrorAlert>

          <div v-else-if="stats" class="grid gap-3 sm:grid-cols-2">
            <div class="border-border-base/50 rounded-lg border px-4 py-3">
              <p class="text-text-secondary text-xs">Active users</p>
              <p class="text-text-primary text-2xl font-semibold">{{ stats.activeUsers }}</p>
            </div>
            <div class="border-border-base/50 rounded-lg border px-4 py-3">
              <p class="text-text-secondary text-xs">Requests per minute</p>
              <p class="text-text-primary text-2xl font-semibold">
                {{ stats.requestsPerMinute }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <Button
              test-id="data-fetching-refetch"
              size="sm"
              :loading="statsFetching"
              @click="refetchStats()"
            >
              Refetch now
            </Button>
            <span class="text-text-secondary text-xs">
              Updated {{ lastUpdated }}. Refetches every
              {{ SERVER_STATS_REFETCH_INTERVAL / 1000 }} seconds.
            </span>
          </div>
        </div>
      </template>
    </ExampleCard>
  </div>
</template>
