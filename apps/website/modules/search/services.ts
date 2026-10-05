import type { ApiFetch } from '~/api/client';
import { apiRoute } from '~/api/endpoints';
import type { ApiEnvelope } from '~/types/api';
import type { SearchHistoryEntry, SearchParams, SearchResults, SearchSuggestion } from './types';

/**
 * Search endpoints. Every call returns the envelope's `data`; failures throw a FetchError.
 * All calls are `silent` (no global toast): the search UI shows its own states.
 *
 * The API docs mark an `x-lang` header as required, but the API's CORS policy doesn't allow
 * it (the browser would block every request). The client's Accept-Language header already
 * localises the response, verified against the dev API on 2026-10-05.
 */
export function createSearchService(api: ApiFetch) {
  return {
    search: async (params: SearchParams, signal?: AbortSignal) =>
      (
        await api<ApiEnvelope<SearchResults>>(apiRoute('search'), {
          query: params,
          signal,
          silent: true,
        })
      ).data,

    /** Typeahead; an empty `q` returns default / trending suggestions. */
    suggestions: async (q: string, limit = 8, signal?: AbortSignal) => {
      const data = (
        await api<ApiEnvelope<SearchSuggestion[]>>(apiRoute('search.suggestions'), {
          query: { q: q || undefined, limit },
          signal,
          silent: true,
        })
      ).data;
      return cleanSuggestions(data);
    },

    /** Recent searches of the signed-in customer. */
    history: async (signal?: AbortSignal) => {
      const data = (
        await api<ApiEnvelope<SearchHistoryEntry[] | SearchHistoryEntry | null>>(
          apiRoute('search.history'),
          { signal, silent: true, skipAuthRedirect: true }
        )
      ).data;
      // The docs show a single object; normalise so either shape works
      return Array.isArray(data) ? data : data ? [data] : [];
    },

    clearHistory: () =>
      api(apiRoute('search.history'), { method: 'DELETE', silent: true, skipAuthRedirect: true }),

    deleteHistoryEntry: (id: string) =>
      api(apiRoute('search.history.entry', { id }), {
        method: 'DELETE',
        silent: true,
        skipAuthRedirect: true,
      }),
  };
}

/**
 * Drops empty or broken entries and duplicates. The dev API returns names like
 * "undefined undefined" for records with missing fields (reported 2026-10-05).
 */
function cleanSuggestions(items: SearchSuggestion[] | null | undefined) {
  const seen = new Set<string>();
  return (items ?? []).filter((item) => {
    const text = item.text?.trim();
    const key = text?.toLowerCase();
    if (!text || !key || /\bundefined\b|\bnull\b/.test(text) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export type SearchService = ReturnType<typeof createSearchService>;

/** Search service bound to the app's fetch client. */
export const useSearchService = (): SearchService => createSearchService(useApi());
