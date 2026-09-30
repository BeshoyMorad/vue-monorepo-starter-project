import { paths } from '@/constants/route-names';

/** Keeps signed-in users out of guest-only pages such as login. */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) return;

  // In-app navigation: stay on the current page.
  // First load: Nuxt passes the target route as `from`, so send the user home instead.
  const cameFromAnotherPage = from.matched.length > 0 && from.fullPath !== to.fullPath;
  return cameFromAnotherPage ? abortNavigation() : navigateTo({ name: paths.dashboard.root });
});
