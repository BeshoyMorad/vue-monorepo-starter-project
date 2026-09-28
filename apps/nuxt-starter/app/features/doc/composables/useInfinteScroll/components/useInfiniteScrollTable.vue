<script setup lang="ts">
  import { USE_DATA_INFINITE_SCROLL_CURSOR_DOC } from '@/features/doc/composables/useInfinteScroll/constants/constants';
  import type { MockAvatarUser } from '@/features/doc/types';
  import { getMockOffsetUsers } from '@/features/doc/composables/useInfinteScroll/constants/mockApi';
  import type { ColumnDef } from '@tanstack/vue-table';

  const columns: ColumnDef<MockAvatarUser, unknown>[] = [
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
  ];
  const { data, isLoading, isFetchingNextPage, hasMore, fetchNextPage, sort, baseParams } =
    useDataInfiniteScroll<MockAvatarUser>({
      queryKey: ['docs-infinite-scroll-users'],
      limit: 10,
      endpoint: '/users',
      paginationType: 'offset',
      initialSort: {
        sortKey: 'id', // accessorKey of the column you want to be initial sort
        order: 'ASC', // 'ASC' or 'DESC' for ascending or descending order
      },
      queryOptions: {
        queryFn: ({ pageParam }: { pageParam: number }) => {
          return getMockOffsetUsers({
            ...baseParams.value,
            page: pageParam,
            limit: 10,
          });
        },
      },
    });
</script>
<template>
  <ExampleCard
    :title="USE_DATA_INFINITE_SCROLL_CURSOR_DOC.title"
    :description="USE_DATA_INFINITE_SCROLL_CURSOR_DOC.description"
    :how-to-use="USE_DATA_INFINITE_SCROLL_CURSOR_DOC.howToUse"
    :header="USE_DATA_INFINITE_SCROLL_CURSOR_DOC.header"
    :code-arr="USE_DATA_INFINITE_SCROLL_CURSOR_DOC.codeArr"
  >
    <template #preview>
      <DataInfiniteScrollTable
        :columns="columns"
        :value="data"
        :loading="isLoading"
        :is-fetching-next-page="isFetchingNextPage"
        :has-more="hasMore"
        max-height="400px"
        @load-more="fetchNextPage"
        @sort="sort"
      />
    </template>
  </ExampleCard>
</template>
