import { defineNuxtRouteMiddleware, navigateTo } from '#imports';
import { useAuthStore } from '@/stores/auth';
import { paths } from '@/constants/route-names';
import { useAuthRedirect } from '@/composables/useAuthRedirect';

/** Sends guests to the login page and remembers where they were going. */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    useAuthRedirect().saveRedirectUrl(to.fullPath);
    return navigateTo({ name: paths.auth.login });
  }
});
