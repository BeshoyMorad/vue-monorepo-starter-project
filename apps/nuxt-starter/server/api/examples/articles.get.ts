/**
 * Demo endpoint for the Data Fetching docs page (native `useFetch` example).
 * Read-only content that rarely changes: the kind of data `useFetch` is for.
 */
const ARTICLES = [
  {
    id: 1,
    title: 'Getting started with the starter',
    summary: 'Install dependencies, set NUXT_PUBLIC_API_BASE_URL and run the dev server.',
    publishedAt: '2026-08-03',
  },
  {
    id: 2,
    title: 'File-based routing',
    summary: 'Every file in app/pages becomes a route. definePageMeta sets its name and title.',
    publishedAt: '2026-08-10',
  },
  {
    id: 3,
    title: 'Route middleware',
    summary: 'auth.global.ts protects every page. Named middleware such as permission is opt-in.',
    publishedAt: '2026-08-17',
  },
  {
    id: 4,
    title: 'Auto-imports',
    summary: 'Components, composables and stores are available without import statements.',
    publishedAt: '2026-08-24',
  },
  {
    id: 5,
    title: 'Localization',
    summary: 'Nuxt i18n loads only the active language file and fetches others on demand.',
    publishedAt: '2026-08-31',
  },
];

export default defineEventHandler((event) => {
  const { limit } = getQuery(event);
  const count = Math.min(Math.max(Number(limit) || 3, 1), ARTICLES.length);

  return { data: ARTICLES.slice(0, count), total: ARTICLES.length };
});
