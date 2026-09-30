import type { AxiosInstance } from '@workspace/core/api';
import type { QueryClient } from '@tanstack/vue-query';

declare module '#app' {
  interface NuxtApp {
    $api: AxiosInstance;
    $queryClient: QueryClient;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: AxiosInstance;
    $queryClient: QueryClient;
  }
}

export {};
