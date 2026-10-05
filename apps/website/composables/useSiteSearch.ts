import { searchScopes } from '~/modules/search/data';
import { paths } from '~/router/paths';

/**
 * Header search state, shared by the desktop bar (SiteSearch), the phone panel
 * (SiteSearchPanel) and the search page, so they all show the same query and scope.
 * Scopes are the API's search domains (see modules/search/data.ts).
 */
export function useSiteSearch() {
  const { t } = useI18n();
  const localePath = useLocalePath();
  // Seeded from the URL on the search page, so the header (rendered before the page) shows it
  const route = useRoute();
  const onSearchPage = useRouteBaseName()(route) === 'search';
  const fromUrl = (key: string) =>
    onSearchPage && typeof route.query[key] === 'string' ? route.query[key] : '';
  const scope = useState<string>(
    'site-search-scope',
    () => (searchScopes.some((item) => item.id === fromUrl('domain')) && fromUrl('domain')) || 'all'
  );
  const query = useState('site-search-query', () => fromUrl('q').trim().slice(0, 100));

  const scopes = computed(() =>
    searchScopes.map((item) => ({
      id: item.id as string,
      label: item.navId ? t(`home.topNav.${item.navId}`) : t('home.header.search.all'),
      icon: item.icon,
    }))
  );
  const current = computed(() => scopes.value.find((item) => item.id === scope.value));
  /** What the placeholder names: "all sections" for All, otherwise the section ("Transport") */
  const scopeName = computed(() =>
    scope.value === 'all' ? t('home.header.search.allSections') : (current.value?.label ?? '')
  );

  /** Opens the search page for the current query and scope (q is capped at 100 by the API) */
  const search = () =>
    navigateTo({
      path: localePath(paths.search),
      query: {
        q: query.value.trim().slice(0, 100) || undefined,
        domain: scope.value === 'all' ? undefined : scope.value,
      },
    });

  return { scope, query, scopes, current, scopeName, search };
}
