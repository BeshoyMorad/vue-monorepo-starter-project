import { paths } from '@/constants/route-names';

export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.auth === false) return;

  const authStore = useAuthStore();
  if (authStore.isAuthenticated) return;

  useAuthRedirect().saveRedirectUrl(to.fullPath);
  return navigateTo({ name: paths.auth.login });
});
