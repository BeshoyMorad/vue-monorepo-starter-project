import { VueQueryPlugin } from '@tanstack/vue-query';
import { defineNuxtPlugin } from '#imports';
import { queryClient } from '@/lib/query-client';

export default defineNuxtPlugin({
  name: 'vue-query',
  setup(nuxtApp) {
    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });
  },
});
