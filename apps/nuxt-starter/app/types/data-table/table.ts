import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { QueryKey, UseInfiniteQueryReturnType, UseQueryReturnType } from '@tanstack/vue-query';
import type { RowData } from '@tanstack/vue-table';
import type { PaginationMeta } from '@/types/api';

export type PaginationType = 'offset' | 'cursor' | 'none';

export type SortOrder = 'ASC' | 'DESC';

/** Query params sent to a paginated list endpoint. */
export interface TableParams {
  page?: number;
  cursor?: string;
  limit: number;
  search?: string;
  filters?: object;
  sortKey?: string;
  order?: SortOrder;
  [key: string]: unknown;
}

export interface TableSort {
  sortKey?: string;
  order?: SortOrder;
}

export interface TableStateOptions<TFilters extends object> {
  query?: MaybeRefOrGetter<TFilters>;
  limit?: number;
  searchDebounce?: number;
  initialSearch?: string;
  initialFilters?: object;
  flatFilters?: boolean;
  initialSort?: TableSort;
  paginationType?: PaginationType;
}

export interface TableStateReturn<TFilters extends object> {
  search: Ref<string>;
  debouncedSearch: Ref<string>;
  isDebouncing: ComputedRef<boolean>;
  filters: Ref<TFilters>;
  setFilters: (newFilters: Partial<TFilters>) => void;
  clearFilters: () => void;
  hasSearch: ComputedRef<boolean>;
  hasFilters: ComputedRef<boolean>;
  hasActiveFilters: ComputedRef<boolean>;
  itemsPerPage: Ref<number>;
  baseParams: ComputedRef<TableParams>;
  page: Ref<number>;
  cursor: Ref<string | null>;
  sortKey: Ref<string | undefined>;
  order: Ref<SortOrder | undefined>;
  sort: (sorting: TableSort) => void;
}

/** UI state shared by `useDataTable` and `useDataInfiniteScroll`. */
export type DataTableState =
  | 'loading'
  | 'empty'
  | 'search-empty'
  | 'filtered-empty'
  | 'success'
  | 'error';

export interface UseTableOptions<
  TFilters extends object = object,
> extends TableStateOptions<TFilters> {
  queryKey: QueryKey;
  endpoint: string;
  queryOptions?: object;
  extractData?: (data: unknown) => unknown[];
}

export type UseDataTableReturn<
  TData,
  TFilters extends object = object,
  TError = Error,
> = TableStateReturn<TFilters> &
  Omit<UseQueryReturnType<unknown, TError>, 'data' | 'meta'> & {
    data: ComputedRef<TData[]>;
    meta: ComputedRef<PaginationMeta | null>;
    isEmpty: ComputedRef<boolean>;
    isSearchEmpty: ComputedRef<boolean>;
    isFilteredEmpty: ComputedRef<boolean>;
    tableState: ComputedRef<DataTableState>;
    dynamicQueryKey: ComputedRef<QueryKey>;
    goToNext: () => void;
    goToPrev: () => void;
    goToPage: (page: number) => void;
    changeLimit: (limit: number) => void;
    extraData: ComputedRef<unknown>;
  };

export interface UseDataInfiniteScrollOptions<
  TFilters extends object = object,
> extends TableStateOptions<TFilters> {
  queryKey: MaybeRefOrGetter<QueryKey>;
  endpoint: MaybeRefOrGetter<string>;
  queryOptions?: object;
  extractData?: (data: unknown) => unknown[];
}

export type UseDataInfiniteScrollReturn<
  TData,
  TFilters extends object = object,
  TError = Error,
> = TableStateReturn<TFilters> &
  Omit<UseInfiniteQueryReturnType<unknown, TError>, 'data' | 'meta' | 'hasNextPage'> & {
    data: ComputedRef<TData[]>;
    meta: ComputedRef<PaginationMeta | null | undefined>;
    isEmpty: ComputedRef<boolean>;
    isSearchEmpty: ComputedRef<boolean>;
    isFilteredEmpty: ComputedRef<boolean>;
    tableState: ComputedRef<DataTableState>;
    hasMore: Ref<boolean>;
    extraData: ComputedRef<unknown>;
    dynamicQueryKey: ComputedRef<QueryKey>;
    changeLimit: (limit: number) => void;
  };

declare module '@tanstack/vue-table' {
  // Generic names must match the library's declaration for the merge to work.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'center' | 'right';
    width?: string;
    colSpan?: number;
  }
}
