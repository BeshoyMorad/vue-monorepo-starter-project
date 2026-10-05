import type { SearchDomain, SearchEntityType } from './types';

/**
 * Search scopes: the API's domains, labelled and iconed like their gold-bar section
 * (home.topNav.<navId>). Permits, our services and media aren't searchable in the API.
 */
export const searchScopes: { id: 'all' | SearchDomain; navId?: string; icon: string }[] = [
  { id: 'all', icon: 'hugeicons--dashboard-square-01' },
  { id: 'marketplace', navId: 'stores', icon: 'hugeicons--store-01' },
  { id: 'veterinary', navId: 'veterinary', icon: 'hugeicons--stethoscope' },
  { id: 'transportation', navId: 'transport', icon: 'hugeicons--delivery-truck-01' },
  { id: 'insurance', navId: 'insurance', icon: 'hugeicons--shield-01' },
];

/** Fallback picture for a hit without a logo */
export const entityIcons: Record<SearchEntityType, string> = {
  doctor: 'hugeicons--doctor-01',
  clinic: 'hugeicons--hospital-01',
  product: 'hugeicons--package',
  store: 'hugeicons--store-01',
  transport_company: 'hugeicons--delivery-truck-01',
  insurance_provider: 'hugeicons--shield-01',
};

/** Results per page on the search page */
export const SEARCH_PAGE_SIZE = 12;
/** Wait after the last keystroke before asking for suggestions */
export const SUGGEST_DEBOUNCE_MS = 250;
/** Recent searches shown in the suggestions when the field is empty */
export const RECENT_LIMIT = 5;
