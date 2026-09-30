import type { AxiosInstance } from '@workspace/core';

/**
 * Returns the Nuxt 3 application configured Axios API client.
 */
export const useApi = (): AxiosInstance => {
  const { $api } = useNuxtApp();
  return $api;
};
