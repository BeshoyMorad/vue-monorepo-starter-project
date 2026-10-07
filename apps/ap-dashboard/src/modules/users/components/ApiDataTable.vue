<script setup lang="ts" generic="TRow extends { id: number | string }">
  import { onMounted, ref, watch } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import type { ColumnDef } from '@tanstack/vue-table';
  import { error as toastError } from '@workspace/core/utils/toast';
  import { Button, Field, Table } from '@workspace/ui';

  interface ApiTableQuery {
    page: number;
    limit: number;
    search?: string;
    sortKey?: string;
    order?: 'ASC' | 'DESC';
  }

  interface AddAction<TRow> {
    text: string;
    icon?: string;
    testId?: string;
    onClick: () => TRow | void | Promise<TRow | void>;
  }

  const props = withDefaults(
    defineProps<{
      columns: ColumnDef<TRow, unknown>[];
      fetchData: (params: ApiTableQuery) => Promise<OffsetPaginatedResponse<TRow>>;
      addAction?: AddAction<TRow>;
      searchPlaceholder?: string;
      limitOptions?: number[];
      debounceMs?: number;
      testId?: string;
    }>(),
    {
      addAction: undefined,
      searchPlaceholder: 'Search...',
      limitOptions: () => [10, 20, 30, 50],
      debounceMs: 350,
      testId: 'api-data-table',
    }
  );

  const rows = ref<TRow[]>([]);
  const search = ref('');
  const isLoading = ref(false);
  const currentPage = ref(1);
  const pageSize = ref(props.limitOptions[0] ?? 10);
  const sortKey = ref<string>();
  const order = ref<'ASC' | 'DESC'>();
  const meta = ref<Meta>({
    currentPage: 1,
    itemsPerPage: pageSize.value,
    totalItems: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  let activeRequest = 0;

  const loadData = async () => {
    const requestId = ++activeRequest;
    isLoading.value = true;
    try {
      const result = await props.fetchData({
        page: currentPage.value,
        limit: pageSize.value,
        search: search.value.trim() || undefined,
        sortKey: sortKey.value,
        order: order.value,
      });
      if (requestId !== activeRequest) return;
      rows.value = result.data;
      meta.value = result.meta;
    } catch (requestError) {
      if (requestId === activeRequest) {
        toastError(requestError instanceof Error ? requestError.message : 'Unable to load data.');
      }
    } finally {
      if (requestId === activeRequest) isLoading.value = false;
    }
  };

  const debouncedSearch = useDebounceFn(
    () => {
      currentPage.value = 1;
      void loadData();
    },
    () => props.debounceMs
  );

  watch(search, () => {
    void debouncedSearch();
  });

  watch(
    () => props.fetchData,
    () => {
      void loadData();
    }
  );

  const onSort = (sorting: { sortKey?: string; order?: 'ASC' | 'DESC' }) => {
    sortKey.value = sorting.sortKey;
    order.value = sorting.order;
    currentPage.value = 1;
    void loadData();
  };

  const onPageChange = (page: number) => {
    currentPage.value = page;
    void loadData();
  };

  const onLimitChange = (limit: number) => {
    pageSize.value = limit;
    currentPage.value = 1;
    void loadData();
  };

  const addRow = (row: TRow) => {
    if (search.value.trim()) return;
    rows.value = [row, ...rows.value].slice(0, pageSize.value);
    meta.value = {
      ...meta.value,
      totalItems: meta.value.totalItems + 1,
      totalPages: Math.ceil((meta.value.totalItems + 1) / pageSize.value),
    };
  };

  const upsertRow = (row: TRow) => {
    const index = rows.value.findIndex((item) => item.id === row.id);
    if (index === -1) return;
    rows.value[index] = row;
  };

  const removeRow = (id: TRow['id']) => {
    rows.value = rows.value.filter((row) => row.id !== id);
    const totalItems = Math.max(0, meta.value.totalItems - 1);
    const totalPages = Math.ceil(totalItems / pageSize.value);
    meta.value = {
      ...meta.value,
      totalItems,
      totalPages,
      hasNextPage: currentPage.value < totalPages,
      hasPreviousPage: currentPage.value > 1,
    };
    if (!rows.value.length && currentPage.value > 1) {
      currentPage.value -= 1;
      void loadData();
    }
  };

  const onAdd = async () => {
    if (!props.addAction) return;
    try {
      const row = await props.addAction.onClick();
      if (row) addRow(row);
    } catch (requestError) {
      toastError(requestError instanceof Error ? requestError.message : 'Unable to add item.');
    }
  };

  onMounted(() => {
    void loadData();
  });

  defineExpose({ refresh: loadData, addRow, upsertRow, removeRow });
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <Field.Text
        v-model="search"
        type="search"
        :placeholder="searchPlaceholder"
        icon="hugeicons--search-01"
        icon-position="left"
        :test-id="`${testId}-search`"
        class="w-full sm:max-w-xs"
      />

      <Button
        v-if="addAction"
        :test-id="addAction.testId ?? `${testId}-add`"
        :icon="addAction.icon"
        @click="onAdd"
      >
        {{ addAction.text }}
      </Button>
    </div>

    <div class="overflow-x-auto">
      <Table
        :columns="columns"
        :value="rows"
        :loading="isLoading"
        :meta="meta"
        :limit-options="limitOptions"
        :is-search-empty="Boolean(search.trim()) && !isLoading && rows.length === 0"
        :test-id="testId"
        @sort="onSort"
        @page-change="onPageChange"
        @limit-change="onLimitChange"
      />
    </div>
  </section>
</template>
