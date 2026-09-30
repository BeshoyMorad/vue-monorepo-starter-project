import type { ApiFetch } from '~/api/client';

/**
 * Returns the app's fetch client (token, locale and error handling included).
 * Call it inside TanStack Query functions rather than directly in components.
 */
export const useApi = (): ApiFetch => useNuxtApp().$api;
