import type { DehydratedState } from '@tanstack/vue-query';
import { VueQueryPlugin, dehydrate, hydrate } from '@tanstack/vue-query';
import { createQueryClient } from '@/lib/query-client';

export default defineNuxtPlugin({
  name: 'vue-query',
  setup(nuxtApp) {
    const vueQueryState = useState<DehydratedState | null>('vue-query', () => null);
    const queryClient = createQueryClient();

    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

    if (import.meta.server) {
      nuxtApp.hooks.hook('app:rendered', () => {
        vueQueryState.value = dehydrate(queryClient);
      });
    }

    if (import.meta.client) {
      hydrate(queryClient, vueQueryState.value);
    }
  },
});
