import { defineNuxtPlugin } from '#imports';
import { getEnvConfig } from '@/config/env';
import { setupApiClient } from '@/lib/api/client';

/** Validates env config and wires the shared Axios instance to the API base URL. */
export default defineNuxtPlugin({
  name: 'api',
  setup() {
    setupApiClient(getEnvConfig().apiBaseUrl);
  },
});
