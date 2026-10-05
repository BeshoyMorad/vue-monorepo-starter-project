<script setup lang="ts">
  import Icon from '@workspace/ui/icon/Icon.vue';
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
  } from '@workspace/ui/ui/pagination';
  import type { SearchPageMeta } from '~/modules/search/types';

  /** Result pages, from the shared pagination. Arrows follow the reading direction. */
  defineProps<{ meta: SearchPageMeta }>();
  const emit = defineEmits<{ change: [page: number] }>();
  const { t } = useI18n();
</script>

<template>
  <Pagination
    v-slot="{ page }"
    :page="meta.page"
    :total="meta.total"
    :items-per-page="meta.limit"
    :sibling-count="1"
    show-edges
    :aria-label="t('search.results.pagination')"
    class="pt-2"
    @update:page="emit('change', $event)"
  >
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious :aria-label="t('search.results.previous')">
        <Icon icon="hugeicons--arrow-left-01" class="size-4 rtl:rotate-180" />
      </PaginationPrevious>
      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === page"
          :aria-label="t('search.results.page', { n: item.value })"
        >
          {{ item.value }}
        </PaginationItem>
        <PaginationEllipsis v-else :index="index" />
      </template>
      <PaginationNext :aria-label="t('search.results.next')">
        <Icon icon="hugeicons--arrow-right-01" class="size-4 rtl:rotate-180" />
      </PaginationNext>
    </PaginationContent>
  </Pagination>
</template>
