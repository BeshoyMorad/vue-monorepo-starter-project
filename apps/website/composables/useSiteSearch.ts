import { topNav } from '~/modules/home/data';

/**
 * Header search state, shared by the desktop bar (SiteSearch) and the phone panel
 * (SiteSearchPanel) so switching between them keeps what was typed.
 */
export function useSiteSearch() {
  const { t } = useI18n();
  const scope = useState('site-search-scope', () => 'all');
  const query = useState('site-search-query', () => '');

  /** "All" plus the platform sections of the gold bar, with their icons */
  const scopes = computed(() => [
    { id: 'all', label: t('home.header.search.all'), icon: 'hugeicons--dashboard-square-01' },
    ...topNav.map((item) => ({
      id: item.id as string,
      label: t(`home.topNav.${item.id}`),
      icon: item.icon as string,
    })),
  ]);
  const current = computed(() => scopes.value.find((item) => item.id === scope.value));
  /** What the placeholder names: "all sections" for All, otherwise the section ("Transport") */
  const scopeName = computed(() =>
    scope.value === 'all' ? t('home.header.search.allSections') : (current.value?.label ?? '')
  );

  // TODO: send to the search page once it exists
  const search = () => undefined;
  return { scope, query, scopes, current, scopeName, search };
}
