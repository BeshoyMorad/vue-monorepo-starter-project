/** Typeahead list of the site search (see composables/useSearchSuggest.ts) */
export type SuggestKind = 'recent' | 'popular' | 'history' | 'suggestion';

export interface SuggestOption {
  key: string;
  text: string;
  kind: SuggestKind;
  /** Position in the flat list (keyboard navigation, option ids) */
  index: number;
  /** History entries behind this option (duplicates are merged), for removal */
  entryIds?: string[];
}

export interface SuggestGroup {
  id: string;
  label: string;
  options: SuggestOption[];
}
