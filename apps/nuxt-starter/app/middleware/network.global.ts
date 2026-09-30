import { paths } from '@/constants/route-names';

/** Sends navigation to the no-internet page while offline, remembering the target. */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || navigator.onLine || to.name === paths.errors.noInternet) return;

  return navigateTo(getOfflineLocation(to.fullPath));
});
