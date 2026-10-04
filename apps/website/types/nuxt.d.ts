import type { ApiFetch } from '~/api/client';
import type { QueryClient } from '@tanstack/vue-query';

declare module '#app' {
  interface NuxtApp {
    $api: ApiFetch;
    $queryClient: QueryClient;
  }
  interface PageMeta {
    /** Signed-in users only (see middleware/auth.global.ts). */
    requiresAuth?: boolean;
    /** Guests only, e.g. login and register (see middleware/auth.global.ts). */
    guestOnly?: boolean;
    /** Permission(s) required by the `permission` middleware, e.g. 'orders.list'. */
    permission?: CanPermission<Models>;
    permissionOperator?: 'or' | 'and';
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ApiFetch;
    $queryClient: QueryClient;
  }
}

export {};
