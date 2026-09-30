import { useAuthStore } from '~/stores/auth';
import { paths } from '~/router/paths';
import { REDIRECT_QUERY_KEY } from '~/constants/auth';
import { getRouteLocale } from '~/utils/locale';
import { getSafeRedirect } from '~/utils/redirect';

/**
 * Page access by auth state, driven by page meta:
 * - definePageMeta({ requiresAuth: true }) → signed-in users only; guests go to login
 *   and come back afterwards through `?redirect=`.
 * - definePageMeta({ guestOnly: true }) → guests only (login, register…); signed-in
 *   users go back to `?redirect=` or home.
 */
export default defineNuxtRouteMiddleware((to) => {
  const requiresAuth = to.meta?.requiresAuth ?? false;
  const guestOnly = to.meta?.guestOnly ?? false;
  if (!requiresAuth && !guestOnly) {
    return;
  }

  const authStore = useAuthStore();
  const localePath = useLocalePath();
  const locale = getRouteLocale(to);

  if (requiresAuth && !authStore.isAuthenticated) {
    return navigateTo({
      path: localePath(paths.auth.login, locale),
      query: { [REDIRECT_QUERY_KEY]: to.fullPath },
    });
  }

  if (guestOnly && authStore.isAuthenticated) {
    return navigateTo(
      getSafeRedirect(to.query[REDIRECT_QUERY_KEY]) ?? localePath(paths.home, locale)
    );
  }
});
