import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import { defineNuxtPlugin } from '#imports';

/** Registers the `v-auto-animate` directive used by FormDialog and MultiStepForm. */
export default defineNuxtPlugin({
  name: 'auto-animate',
  setup(nuxtApp) {
    nuxtApp.vueApp.use(autoAnimatePlugin);
  },
});
