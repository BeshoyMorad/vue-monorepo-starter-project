import { useAuthStore } from '~/stores/auth';
import { paths } from '~/router/paths';

export default defineNuxtRouteMiddleware((to) => {
  // Check if route explicitly requires authentication via page metadata
  const requiresAuth = to.meta?.requiresAuth ?? false;
  if (!requiresAuth) {
    return;
  }

  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    return navigateTo(paths.auth.login);
  }
});
