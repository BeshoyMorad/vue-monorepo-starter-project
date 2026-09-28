import { defineNuxtRouteMiddleware, navigateTo } from '#imports';
import { paths } from '@/constants/route-names';
import { getOfflineLocation } from '@/composables/useNetwork';

/** Sends navigation to the no-internet page while offline, remembering the target. */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || navigator.onLine || to.name === paths.errors.noInternet) return;

  return navigateTo(getOfflineLocation(to.fullPath));
});
