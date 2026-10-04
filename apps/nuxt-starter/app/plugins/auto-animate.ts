import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

/** Registers the `v-auto-animate` directive used by FormDialog and MultiStepForm. */
export default defineNuxtPlugin({
  name: 'auto-animate',
  setup(nuxtApp) {
    nuxtApp.vueApp.use(autoAnimatePlugin);
  },
});
