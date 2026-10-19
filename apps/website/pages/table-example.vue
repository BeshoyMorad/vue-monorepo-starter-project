<script setup lang="ts">
  import { computed } from 'vue';
  import { useDataTable, type TableParams } from '@workspace/core/composables';
  import { Table, Button, PageWrapper, StatusBadge, Field } from '@workspace/ui';
  import {
    getMockWebsiteUsers,
    type WebsiteMockUser,
    type WebsiteUserFilters,
  } from '~/data/mockUsers';

  useSeoMeta({
    title: 'Data Table SSR Example — Workspace Website',
    description:
      'Demonstrating useDataTable composable paired with Table and TablePagination primitives in Nuxt 3.',
  });

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
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
    {
      accessorKey: 'status',
      header: 'Status',
    },
  ];

  const roleOptions = [
    { label: 'All Roles', value: 'all' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' },
    { label: 'User', value: 'User' },
  ];

  const {
    data: tableData,
    meta: tableMeta,
    isLoading: tableIsLoading,
    isSearchEmpty: tableIsSearchEmpty,
    isFilteredEmpty: tableIsFilteredEmpty,
    goToPrev,
    goToNext,
    changeLimit,
    goToPage,
    sort,
    search,
    filters,
    clearFilters,
    refetch,
  } = useDataTable<WebsiteMockUser, WebsiteUserFilters>({
    queryKey: ['website-demo-table'],
    endpoint: '/mock-users',
    paginationType: 'offset',
    limit: 5,
    queryOptions: {
      queryFn: ({ queryKey }: { queryKey: [string, TableParams] }) => {
        return getMockWebsiteUsers(queryKey[1]);
      },
    },
  });

  const totalItems = computed(() => {
    if (tableMeta.value && 'totalItems' in tableMeta.value) {
      return (tableMeta.value as Meta).totalItems;
    }
    return 0;
  });

  const handleClear = () => {
    search.value = '';
    clearFilters();
  };
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-text-default text-2xl font-bold">Data Table (useDataTable)</h1>
        <p class="text-text-caption text-sm">
          Unified TanStack Table + Vue Query integration with server pagination, sorting, search,
          and RTL support.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <StatusBadge :variant="tableIsLoading ? 'warning' : 'success'" test-id="badge-table-status">
          {{ tableIsLoading ? 'Loading Data...' : 'Synchronized' }}
        </StatusBadge>
        <Button
          test-id="btn-refresh-table"
          size="sm"
          outline
          :loading="tableIsLoading"
          @click="() => refetch()"
        >
          Refresh
        </Button>
      </div>
    </div>

    <PageWrapper title="Interactive Users Table">
      <!-- Search and Filter Toolbar -->
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <!-- Search input -->
          <div class="w-full sm:w-72">
            <Field.Text
              v-model="search"
              name="search"
              placeholder="Search name, email, or role..."
              test-id="table-search-input"
            />
          </div>

          <!-- Role Filter -->
          <div class="w-full sm:w-44">
            <Field.Select
              v-model="filters.role"
              name="roleFilter"
              placeholder="Select Role"
              :options="roleOptions"
              option-label="label"
              option-value="value"
              test-id="table-role-select"
            />
          </div>

          <Button
            v-if="search || (filters.role && filters.role !== 'all')"
            variant="ghost"
            size="sm"
            test-id="btn-clear-table-filters"
            @click="handleClear"
          >
            Clear Filters
          </Button>
        </div>

        <div class="text-text-disabled text-xs">Total items: {{ totalItems }}</div>
      </div>

      <!-- Core Table Primitive -->
      <Table
        :columns="columns"
        :value="tableData"
        :meta="tableMeta"
        :loading="tableIsLoading"
        :is-search-empty="tableIsSearchEmpty"
        :is-filtered-empty="tableIsFilteredEmpty"
        :limit-options="[5, 10, 15]"
        @sort="sort"
        @next="goToNext"
        @prev="goToPrev"
        @page-change="goToPage"
        @limit-change="changeLimit"
      />
    </PageWrapper>
  </div>
</template>
