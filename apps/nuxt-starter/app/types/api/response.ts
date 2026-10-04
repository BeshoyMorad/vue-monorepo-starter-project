/** Standard success envelope returned by every API endpoint. */
export interface ApiResponse<T = unknown> {
  message: string;
  data: T;
}

/** Error body returned by the API for 4xx/5xx responses. */
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
  errors?: Record<string, string | string[]>;
}

/** Pagination meta for page-number (offset) endpoints. */
export interface OffsetMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** Pagination meta for cursor endpoints. */
export interface CursorMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string | null;
  previousCursor: string | null;
  limit: number;
}

export type PaginationMeta = OffsetMeta | CursorMeta;

export interface OffsetPaginatedResponse<T = unknown> {
  data: T[];
  meta: OffsetMeta;
}

export interface CursorPaginatedResponse<T = unknown> {
  data: T[];
  meta: CursorMeta;
}
