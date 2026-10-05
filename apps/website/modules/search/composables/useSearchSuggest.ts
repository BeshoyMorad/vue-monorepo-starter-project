import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import { queryKeys } from '~/api/query-keys';
import { RECENT_LIMIT, SUGGEST_DEBOUNCE_MS } from '~/modules/search/data';
import { searchHistoryQueryOptions, searchSuggestionsQueryOptions } from '~/modules/search/queries';
import { useSearchService } from '~/modules/search/services';
import type { SearchHistoryEntry, SearchSuggestion } from '~/modules/search/types';
import { useAuthStore } from '~/stores/auth';

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

interface SuggestOptions {
  /** Called after an option is picked; `query` already holds its text */
  onPick: () => void;
  /** Escape closes the list (desktop popup). The phone panel leaves Escape to its dialog. */
  closeOnEscape?: boolean;
}

/** The trimmed query, updated once typing pauses (clearing the field applies at once) */
function useDebouncedQuery(query: Ref<string>) {
  const typed = ref(query.value.trim().slice(0, 100));
  let timer: ReturnType<typeof setTimeout> | undefined;
  watch(query, (value) => {
    clearTimeout(timer);
    const next = value.trim().slice(0, 100);
    if (!next) {
      typed.value = '';
      return;
    }
    timer = setTimeout(() => (typed.value = next), SUGGEST_DEBOUNCE_MS);
  });
  onBeforeUnmount(() => clearTimeout(timer));
  return typed;
}

/**
 * Empty field: recent searches (signed in) then popular ones, without repeats.
 * Typing: the API's suggestions, which list the customer's own history first.
 */
function buildGroups(
  typing: boolean,
  history: SearchHistoryEntry[],
  suggestions: SearchSuggestion[],
  t: (key: string) => string
): SuggestGroup[] {
  let index = 0;
  const option = (text: string, kind: SuggestKind, key: string, entryIds?: string[]) => ({
    key,
    text: text.trim(),
    kind,
    index: index++,
    entryIds,
  });

  if (typing) {
    const items = suggestions.map((item) =>
      option(item.text, item.source === 'history' ? 'history' : 'suggestion', `s-${item.text}`)
    );
    return items.length
      ? [{ id: 'suggestions', label: t('search.suggest.suggestions'), options: items }]
      : [];
  }

  const seen = new Set<string>();
  const firstTime = (text: string) => {
    const key = text.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  };
  const sameQuery = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
  const recent = history
    .filter((entry) => firstTime(entry.query ?? ''))
    .slice(0, RECENT_LIMIT)
    .map((entry) => {
      const ids = history
        .filter((other) => sameQuery(other.query ?? '', entry.query))
        .map((e) => e.id);
      return option(entry.query, 'recent', `r-${entry.id}`, ids);
    });
  const popular = suggestions
    .filter((item) => firstTime(item.text))
    .slice(0, 5)
    .map((item) => option(item.text, 'popular', `p-${item.text}`));
  return [
    { id: 'recent', label: t('search.suggest.recent'), options: recent },
    { id: 'popular', label: t('search.suggest.popular'), options: popular },
  ].filter((group) => group.options.length);
}

/** Fetches suggestions (and history when signed in) while the list may show, and groups them */
function useSuggestGroups(query: Ref<string>, open: Ref<boolean>) {
  const { t, locale } = useI18n();
  const service = useSearchService();
  const authStore = useAuthStore();
  const typed = useDebouncedQuery(query);

  const suggestions = useQuery(
    computed(() => searchSuggestionsQueryOptions(service, typed.value, locale.value, open.value))
  );
  const history = useQuery(
    computed(() => searchHistoryQueryOptions(service, open.value && authStore.isAuthenticated))
  );

  return computed(() =>
    buildGroups(
      Boolean(query.value.trim()),
      authStore.isAuthenticated ? (history.data.value ?? []) : [],
      suggestions.data.value ?? [],
      t
    )
  );
}

/**
 * Removing recent searches: dropped from the cache at once and put back if the request
 * fails. Suggestions mix in history too, so all search queries refresh afterwards.
 */
function useHistoryActions(onDone: (message: string) => void) {
  const { t } = useI18n();
  const service = useSearchService();
  const queryClient = useQueryClient();
  const key = queryKeys.search.history();

  const optimistic = async (update: (list: SearchHistoryEntry[]) => SearchHistoryEntry[]) => {
    await queryClient.cancelQueries({ queryKey: key });
    const previous = queryClient.getQueryData<SearchHistoryEntry[]>(key);
    queryClient.setQueryData<SearchHistoryEntry[]>(key, (list) => update(list ?? []));
    return { previous };
  };
  const shared = {
    onError: (_e: unknown, _v: unknown, context?: { previous?: SearchHistoryEntry[] }) =>
      queryClient.setQueryData(key, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.search.all() }),
  };

  const removeOne = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => service.deleteHistoryEntry(id))),
    onMutate: (ids: string[]) => optimistic((list) => list.filter((e) => !ids.includes(e.id))),
    onSuccess: () => onDone(t('search.suggest.removed')),
    ...shared,
  });
  const removeAll = useMutation({
    mutationFn: (_: void) => service.clearHistory(),
    onMutate: () => optimistic(() => []),
    onSuccess: () => onDone(t('search.suggest.cleared')),
    ...shared,
  });

  return {
    remove: (ids?: string[]) => ids?.length && removeOne.mutate(ids),
    clearAll: () => removeAll.mutate(),
  };
}

/** Arrow keys move through the options, Enter picks, Escape closes, Delete removes a recent one */
function createKeyHandler(state: {
  open: Ref<boolean>;
  visible: Ref<boolean>;
  flat: Ref<SuggestOption[]>;
  activeIndex: Ref<number>;
  closeOnEscape: boolean;
  pick: (text: string) => void;
  remove: (ids?: string[]) => void;
}) {
  const { open, visible, flat, activeIndex } = state;
  const step = (by: 1 | -1) => {
    const count = flat.value.length;
    if (!count) return;
    // -1 is the field itself: the list wraps through it
    activeIndex.value = ((activeIndex.value + 1 + by + count + 1) % (count + 1)) - 1;
  };
  return (event: KeyboardEvent) => {
    const option = flat.value[activeIndex.value];
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open.value) open.value = true;
      else step(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter' && visible.value && option) {
      event.preventDefault();
      state.pick(option.text);
    } else if (event.key === 'Escape' && state.closeOnEscape && visible.value) {
      event.preventDefault();
      open.value = false;
    } else if (event.key === 'Delete' && visible.value && option?.kind === 'recent') {
      event.preventDefault();
      state.remove(option.entryIds);
    }
  };
}

/**
 * Combobox logic for the header search (ARIA 1.2 combobox + listbox): suggestions while
 * typing, recent and popular searches when the field is empty, keyboard navigation and
 * removing recent searches. `open` says whether the list may show (field focused, or the
 * phone panel open).
 */
export function useSearchSuggest(query: Ref<string>, open: Ref<boolean>, options: SuggestOptions) {
  const { t } = useI18n();
  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const groups = useSuggestGroups(query, open);
  const flat = computed(() => groups.value.flatMap((group) => group.options));
  const visible = computed(() => open.value && flat.value.length > 0);
  const hasRecent = computed(() => flat.value.some((option) => option.kind === 'recent'));

  const activeIndex = ref(-1);
  watch(
    () => flat.value.map((option) => option.key).join('|'),
    () => (activeIndex.value = -1)
  );
  watch(open, (isOpen) => !isOpen && (activeIndex.value = -1));
  const optionId = (index: number) => `${uid}-opt-${index}`;
  const activeDescendant = computed(() =>
    visible.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined
  );

  // Polite screen-reader updates: how many suggestions, or what was just removed
  const notice = ref('');
  watch(query, () => (notice.value = ''));
  const status = computed(() => {
    if (notice.value) return notice.value;
    return visible.value && query.value.trim() ? t('search.suggest.count', flat.value.length) : '';
  });

  const { remove, clearAll } = useHistoryActions((message) => (notice.value = message));
  const pick = (text: string) => {
    query.value = text;
    options.onPick();
  };
  const onKeydown = createKeyHandler({
    open,
    visible,
    flat,
    activeIndex,
    closeOnEscape: options.closeOnEscape !== false,
    pick,
    remove,
  });

  return {
    listboxId,
    groups,
    visible,
    hasRecent,
    activeIndex,
    activeDescendant,
    optionId,
    setActive: (index: number) => (activeIndex.value = index),
    status,
    query,
    pick,
    remove,
    clearAll,
    onKeydown,
  };
}

export type SearchSuggest = ReturnType<typeof useSearchSuggest>;
