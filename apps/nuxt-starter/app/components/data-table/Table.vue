<script setup lang="ts" generic="TRow">
  import type { CursorMeta, OffsetMeta } from '@/types/api';
  import { cn } from '@/utils';
  import { type ColumnDef } from '@tanstack/vue-table';
  import { Table } from '@/components/ui/table';
  import { useTableRowClick } from '@/composables/data-table/useTableRowClick';
  import { useDataTableState } from '@/composables/data-table/useDataTableState';

  interface Props {
    columns: ColumnDef<TRow, unknown>[];
    value: TRow[];
    loading?: boolean;
    meta?: OffsetMeta | CursorMeta | null;
    limitOptions?: number[];
    clickable?: boolean;
    isFilteredEmpty?: boolean;
    isSearchEmpty?: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'sort', sorting: { sortKey?: string; order?: 'ASC' | 'DESC' }): void;
    (e: 'pageChange', page: number): void;
    (e: 'limitChange', limit: number): void;
    (e: 'next'): void;
    (e: 'prev'): void;
    (e: 'rowClick', row: TRow): void;
  }>();

  const { isRowClickable, handleRowClick } = useTableRowClick<TRow>(
    () => props.clickable || false,
    (row) => emit('rowClick', row)
  );

  const { table } = useDataTableState<TRow>({
    value: () => props.value,
    columns: () => props.columns,
    onSort: (sorting) => emit('sort', sorting),
  });
</script>

<template>
  <Table container-class="rounded-md relative w-full">
    <TableHeader>
      <DataTableHead :table="table" />
    </TableHeader>

    <TableBody>
      <template v-if="loading">
        <TableRow v-for="i in 10" :key="`skeleton-row-${i}`">
          <TableCell v-for="(_, index) in columns.length" :key="`skeleton-col-${index}`">
            <Skeleton class="h-4 w-[60%]" />
          </TableCell>
        </TableRow>
      </template>

      <template v-else-if="table.getRowModel().rows?.length">
        <DataTableRow
          v-for="(row, index) in table.getRowModel().rows"
          :key="row.id"
          :row="row"
          :index="index"
          :class="cn(isRowClickable && 'hover:bg-default-hovered cursor-pointer transition-colors')"
          @click="handleRowClick(row.original, $event)"
        />
      </template>

      <TableRow v-else-if="!loading">
        <TableCell :colspan="columns.length">
          <slot name="empty">
            <EmptyPlaceholder
              v-if="isSearchEmpty"
              icon="hugeicons--search-remove"
              title="No Results Found"
              description="No data matches your current search."
            />
            <EmptyPlaceholder
              v-else-if="isFilteredEmpty"
              icon="hugeicons--search-remove"
              title="No Results Found"
              description="No data matches your current filters."
            />
            <EmptyPlaceholder v-else />
          </slot>
        </TableCell>
      </TableRow>
    </TableBody>

    <template #footer>
      <DataTablePagination
        :meta="meta"
        :limit-options="limitOptions"
        @page-change="emit('pageChange', $event)"
        @limit-change="emit('limitChange', $event)"
        @next="emit('next')"
        @prev="emit('prev')"
      />
    </template>
  </Table>
</template>
