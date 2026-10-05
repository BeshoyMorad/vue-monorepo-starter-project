import type { ApiClient } from '@workspace/core/lib';
import type { QueryClient } from '@tanstack/vue-query';

declare module '#app' {
  interface NuxtApp {
    $api: ApiClient;
    $queryClient: QueryClient;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ApiClient;
    $queryClient: QueryClient;
  }
}

export {};
