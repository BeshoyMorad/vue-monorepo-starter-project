import {
  VueQueryPlugin,
  dehydrate,
  hydrate,
  type DehydratedState,
  type QueryClient,
} from '@tanstack/vue-query';
import { createBaseQueryClient } from '@workspace/core/lib/query-client';

export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query', () => null);

  // Initialize QueryClient per request to avoid cross-request data leaks on server
  const queryClient: QueryClient = createBaseQueryClient(
    undefined,
    () => (nuxtApp.$i18n as { locale: { value: string } }).locale.value
  );

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  if (import.meta.server) {
    nuxtApp.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    if (vueQueryState.value) {
      hydrate(queryClient, vueQueryState.value);
    }
  }

  return {
    provide: {
      queryClient,
    },
  };
});
