import { defineNuxtPlugin } from '#imports';
import { error as toastError } from '@/utils/toast';

/** Last-resort handler for component errors that no ErrorBoundary caught. */
export default defineNuxtPlugin({
  name: 'error-handler',
  setup(nuxtApp) {
    nuxtApp.hook('vue:error', (err, _instance, info) => {
      // eslint-disable-next-line no-console
      console.error('[Global Vue Error]:', err, info);
      toastError('An unexpected component error occurred.');
    });
  },
});
