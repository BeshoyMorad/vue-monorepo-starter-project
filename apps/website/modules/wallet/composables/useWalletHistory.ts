import { useQuery } from '@tanstack/vue-query';
import { matchesSearch, pageOf } from '~/modules/wallet/activity';
import { historyQueryOptions } from '~/modules/wallet/queries';
import { useWalletService } from '~/modules/wallet/services';
import type { PaymentMethod, TransactionStatus } from '~/modules/wallet/types';

const PAGE_SIZE = 10;
/** Transactions searched through: the most the history endpoint returns in one page */
export const SEARCH_POOL = 100;
/** Pause after typing before the search runs */
const SEARCH_DELAY = 400;

/**
 * The wallet's history with its filters, ten per page. Payment method and status are
 * filtered by the API. The API only matches a whole reference, so the search box is
 * matched here instead: the latest {@link SEARCH_POOL} transactions (with the other
 * filters) are loaded and matched on part of the reference, transaction id, order number
 * or title, then paged here.
 */
export function useWalletHistory(walletId: MaybeRefOrGetter<string>) {
  const { t } = useI18n();
  const service = useWalletService();

  const typed = ref('');
  const term = ref('');
  const paymentMethod = ref<PaymentMethod | ''>('');
  const status = ref<TransactionStatus | ''>('');
  const page = ref(1);
  watch([term, paymentMethod, status], () => (page.value = 1));

  const searching = computed(() => Boolean(term.value));
  const params = computed(() => ({
    walletId: toValue(walletId),
    page: searching.value ? 1 : page.value,
    limit: searching.value ? SEARCH_POOL : PAGE_SIZE,
    paymentMethod: paymentMethod.value || undefined,
    status: status.value || undefined,
  }));
  const history = useQuery(computed(() => historyQueryOptions(service, params.value)));

  const matches = computed(() =>
    (history.data.value?.items ?? []).filter((item) =>
      matchesSearch(item, term.value, t(`wallet.transactions.domains.${item.domain}`))
    )
  );
  /** The rows and page info shown, whether paged by the API or by the search */
  const shown = computed(() => {
    const data = history.data.value;
    return data && searching.value ? pageOf(matches.value, page.value, PAGE_SIZE) : data;
  });
  /** The search only covered the latest SEARCH_POOL transactions */
  const searchPartial = computed(
    () => searching.value && (history.data.value?.meta.total ?? 0) > SEARCH_POOL
  );
  const filtered = computed(() => Boolean(term.value || paymentMethod.value || status.value));

  // Searches once typing pauses (or on Enter); emptying the box shows everything at once
  let timer: ReturnType<typeof setTimeout> | undefined;
  const search = () => {
    clearTimeout(timer);
    term.value = typed.value.trim();
  };
  watch(typed, (value) => {
    clearTimeout(timer);
    if (!value.trim()) term.value = '';
    else timer = setTimeout(search, SEARCH_DELAY);
  });
  onScopeDispose(() => clearTimeout(timer));

  const clear = () => {
    [typed.value, term.value, paymentMethod.value, status.value] = ['', '', '', ''];
  };

  return {
    typed,
    paymentMethod,
    status,
    page,
    history,
    shown,
    searchPartial,
    filtered,
    search,
    clear,
  };
}
