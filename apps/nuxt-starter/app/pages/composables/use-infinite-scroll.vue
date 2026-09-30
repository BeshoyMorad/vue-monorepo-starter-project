<script setup lang="ts">
  import { paths } from '@/constants/route-names';
  import { USE_DATA_INFINITE_SCROLL_DOM } from '@/features/doc/composables/useInfinteScroll/constants/constants.ts';
  import UseInfiniteScrollImport from '@/features/doc/composables/useInfinteScroll/components/useInfiniteScrollImport.vue';
  import UseInfiniteScrollDefination from '@/features/doc/composables/useInfinteScroll/components/useInfiniteScrollDefination.vue';
  import UseInfiniteScrollOffset from '@/features/doc/composables/useInfinteScroll/components/useInfiniteScrollOffset.vue';
  import UseInfiniteScrollCursor from '@/features/doc/composables/useInfinteScroll/components/useInfiniteScrollCursor.vue';
  import UesInfiniteScrollFilter from '@/features/doc/composables/useInfinteScroll/components/uesInfiniteScrollFilter.vue';
  import UseInfiniteScrollSearch from '@/features/doc/composables/useInfinteScroll/components/useInfiniteScrollSearch.vue';
  import UseInfiniteScrollVirtual from '@/features/doc/composables/useInfinteScroll/components/useInfiniteScrollVirtual.vue';
  import UseInfiniteScrollTable from '@/features/doc/composables/useInfinteScroll/components/useInfiniteScrollTable.vue';

  definePageMeta({
    name: paths.composablesPaths.infiniteScroll,
    title: 'useInfiniteScroll',
    sidebar: true,
    order: 3,
  });
</script>

<template>
  <div class="mx-auto w-full space-y-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <section class="space-y-2">
      <h1 class="text-text-primary heading-font text-3xl font-bold tracking-tight">
        {{ USE_DATA_INFINITE_SCROLL_DOM.title }}
      </h1>

      <p class="text-text-secondary max-w-3xl text-sm leading-6">
        {{ USE_DATA_INFINITE_SCROLL_DOM.description }}
      </p>
    </section>

    <!-- Import -->
    <UseInfiniteScrollImport />

    <!-- What is useDataInfiniteScroll? -->
    <UseInfiniteScrollDefination />

    <!-- Examples -->
    <section class="space-y-6">
      <div class="space-y-2">
        <h2 class="text-text-primary text-xl font-semibold">Pagination</h2>

        <p class="text-text-secondary text-sm">
          useDataInfiniteScroll supports offset and cursor pagination. Choose the pagination type
          that matches your API.
        </p>
      </div>
      <!-- Offset Pagination -->
      <UseInfiniteScrollOffset />
      <!-- Cursor Pagination -->
      <UseInfiniteScrollCursor />
    </section>
    <!-- Filter -->
    <UesInfiniteScrollFilter />

    <!-- Search -->
    <UseInfiniteScrollSearch />

    <!-- Virtual Scroll -->
    <UseInfiniteScrollVirtual />

    <!-- InfiniteScrollTable -->
    <UseInfiniteScrollTable />
  </div>
</template>
