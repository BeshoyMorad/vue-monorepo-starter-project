import { keepPreviousData, queryOptions } from '@tanstack/vue-query';
import { queryKeys } from '~/api/query-keys';
import type { SearchService } from './services';
import type { SearchParams } from './types';

/** Search results page. Keeps the previous page on screen while the next one loads. */
export const searchResultsQueryOptions = (
  service: SearchService,
  params: SearchParams,
  locale: string
) =>
  queryOptions({
    queryKey: queryKeys.search.results({ ...params, locale }),
    queryFn: ({ signal }) => service.search(params, signal),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

/** Typeahead suggestions for a prefix ('' = popular). Keeps the last list while typing. */
export const searchSuggestionsQueryOptions = (
  service: SearchService,
  q: string,
  locale: string,
  enabled = true
) =>
  queryOptions({
    enabled,
    queryKey: queryKeys.search.suggestions(q, locale),
    queryFn: ({ signal }) => service.suggestions(q, 8, signal),
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });

/** Recent searches of the signed-in customer */
export const searchHistoryQueryOptions = (service: SearchService, enabled = true) =>
  queryOptions({
    enabled,
    queryKey: queryKeys.search.history(),
    queryFn: ({ signal }) => service.history(signal),
    staleTime: 30_000,
  });
