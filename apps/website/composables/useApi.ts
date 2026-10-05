import type { ApiClient } from '@workspace/core/lib';

/**
 * Returns the Nuxt 3 application configured ofetch API client.
 */
export const useApi = (): ApiClient => {
  const { $api } = useNuxtApp();
  return $api;
};
