<script setup lang="ts">
  import type { MockUser } from '@/features/doc/types';
  import type { ColumnDef } from '@tanstack/vue-table';

  import {
    TABLE_CURSOR_PAGINATION,
    TABLE_CODE_HEADER_SCRIPT,
  } from '@/features/doc/components/table/constants/constants';
  import { useTableCursorPagination } from '@/features/doc/components/table/composables/useTableCursorPagination';

  const { t } = useAppLocale();

  const columns: ColumnDef<MockUser, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
  ];

  const { users, meta, handleLimitChange, handleNext, handlePrevious } = useTableCursorPagination();
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-text-primary text-xl font-semibold">
        {{ t(TABLE_CURSOR_PAGINATION.nameKey) }}
      </h2>

      <p class="text-text-secondary mt-1 text-sm">
        {{ t(TABLE_CURSOR_PAGINATION.descriptionKey) }}
      </p>
    </div>

    <ExampleCard
      :title="t(TABLE_CURSOR_PAGINATION.nameKey)"
      :description="t(TABLE_CURSOR_PAGINATION.descriptionKey)"
      :how-to-use="t('table.howToUse.description')"
      :code="TABLE_CURSOR_PAGINATION.code"
      :preview-label="t('table.preview')"
      :usage-label="t('table.howToUse.title')"
      :border="false"
      :header="TABLE_CODE_HEADER_SCRIPT"
    >
      <template #preview>
        <div class="border-border-base/50 w-full rounded-lg border p-6">
          <DataTable
            :columns="columns"
            :value="users"
            :meta="meta"
            :limit-options="[5, 10, 20]"
            @next="handleNext"
            @prev="handlePrevious"
            @limit-change="handleLimitChange"
          />
        </div>
      </template>
    </ExampleCard>
  </section>
</template>
