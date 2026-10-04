import { createWebsiteApi } from '~/api/client';

/**
 * Registers the fetch client as `$api` (typed in types/nuxt.d.ts).
 * Use it inside TanStack Query: `queryFn: ({ signal }) => api('/path', { signal })`.
 * Get it with `useApi()` in components/composables, or `useNuxtApp().$api`.
 * Provided imperatively (not returned) to avoid circular plugin types.
 */
export default defineNuxtPlugin({
  name: 'api',
  setup(nuxtApp) {
    nuxtApp.provide('api', createWebsiteApi());
  },
});
