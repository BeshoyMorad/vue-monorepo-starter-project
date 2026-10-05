/** Search API types (GET /user/search, /user/search/suggestions, /user/search-history). */

export const SEARCH_DOMAINS = ['marketplace', 'veterinary', 'transportation', 'insurance'] as const;
export type SearchDomain = (typeof SEARCH_DOMAINS)[number];

export const ENTITY_TYPES = [
  'doctor',
  'clinic',
  'product',
  'store',
  'transport_company',
  'insurance_provider',
] as const;
export type SearchEntityType = (typeof ENTITY_TYPES)[number];

export interface SearchParams {
  q?: string;
  domain?: SearchDomain;
  entityType?: SearchEntityType;
  page?: number;
  limit?: number;
}

/** One hit. Optional fields are left out by the API when empty. */
export interface SearchHit {
  id: string;
  entityId: string;
  entityType: SearchEntityType;
  entityDomain: SearchDomain;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  highlights?: string[];
  storeSlug?: string;
  categorySlug?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface SearchPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchResults {
  items: SearchHit[];
  meta: SearchPageMeta;
}

/** Typeahead entry. `history` items (signed-in customers) come before `global` ones. */
export interface SearchSuggestion {
  source: 'history' | 'global';
  text: string;
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  domain?: string | null;
  entityType?: string | null;
  createdAt: string;
}
