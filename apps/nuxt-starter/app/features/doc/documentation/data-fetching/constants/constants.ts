export const DATA_FETCHING_DOM = {
  title: 'Data Fetching',

  description:
    'The starter supports two ways to load data. Nuxt’s built-in useFetch and useAsyncData suit read-only content. TanStack Query suits interactive data that must stay fresh, be shared between components, or be changed with mutations.',

  choosing: {
    title: 'Which one should I use?',
    description:
      'Pick the tool by how the data behaves, not by where it is shown. Both can be used on the same page.',
  },

  native: {
    title: 'Native Nuxt fetching: useFetch',
    description:
      'For read-only, SEO-relevant content such as articles, product pages or settings that rarely change. With server rendering on, Nuxt fetches the data on the server, embeds it in the HTML and reuses it in the browser without a second request.',
    howToUse:
      'Call useFetch with a URL and a unique key. Pass refs in query or params and useFetch refetches when they change. Call refresh() to reload by hand. This starter currently runs with ssr: false, so the request runs in the browser. The same code becomes server-rendered once SSR is enabled.',
  },

  tanstack: {
    title: 'TanStack Query: useQuery',
    description:
      'For interactive data: dashboards, tables with filters, anything that polls, refetches on focus, or is invalidated after a mutation. Queries are cached by key and shared by every component that uses them.',
    howToUse:
      'Wrap useQuery in a composable in the feature’s composables folder, and register its key in app/lib/query-keys.ts. This example polls every 5 seconds and pauses while the tab is hidden.',
  },
} as const;

export const DATA_FETCHING_COMPARISON = [
  {
    tool: 'useFetch / useAsyncData',
    useFor: 'Read-only content, SEO pages, data needed for the first render',
    examples: 'Articles, product details, CMS pages, app settings',
  },
  {
    tool: 'TanStack Query',
    useFor: 'Interactive or live data, shared cache, mutations and invalidation',
    examples: 'Dashboards, filtered tables, infinite lists, forms that update data',
  },
] as const;

export const NATIVE_USE_FETCH_CODE = `const limit = ref(3);

const { data, status, error, refresh } = await useFetch('/api/examples/articles', {
  key: 'docs-example-articles',
  query: { limit }, // refetches automatically when limit changes
});`;

export const NATIVE_USE_ASYNC_DATA_CODE = `// useAsyncData wraps any async function, e.g. the shared Axios client.
const { data: profile } = await useAsyncData('starter-profile', async () => {
  const response = await api.get<ApiResponse<StarterProfile>>(apiRoute('starter.profile'));
  return response.data.data;
});`;

export const NATIVE_SERVER_ROUTE_CODE = `// server/api/examples/articles.get.ts
export default defineEventHandler((event) => {
  const { limit } = getQuery(event);
  const count = Math.min(Math.max(Number(limit) || 3, 1), ARTICLES.length);

  return { data: ARTICLES.slice(0, count), total: ARTICLES.length };
});`;

export const TANSTACK_COMPOSABLE_CODE = `import { useQuery } from '@tanstack/vue-query';
import { QUERY_KEYS } from '@/lib/query-keys';

export function useServerStatsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.examples.serverStats(),
    queryFn: () => $fetch('/api/examples/server-stats'),
    refetchInterval: 5000,             // poll every 5 seconds
    refetchIntervalInBackground: false, // pause while the tab is hidden
    staleTime: 0,                       // always treat cached data as stale
  });
}`;

export const TANSTACK_USAGE_CODE = `const { data, isPending, isFetching, isError, dataUpdatedAt, refetch } =
  useServerStatsQuery();`;
