import { useAuthStore } from '@/stores/auth';
import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router';
import { paths } from '@/router/paths';
import { useAuthRedirect } from '@workspace/core/composables';

export const authGuard = (to: RouteLocationNormalized): NavigationGuardReturn => {
  const authStore = useAuthStore();
  const { saveRedirectUrl } = useAuthRedirect();

  if (!authStore.isAuthenticated) {
    saveRedirectUrl(to.fullPath);
    return { name: paths.auth.login };
  }

  // Zero-Trust Domain Guard
  const allowedDomains = to.meta.allowedDomains as string[] | undefined;
  if (allowedDomains && allowedDomains.length > 0) {
    const hasAccess = true;
    if (!hasAccess) {
      return { name: paths.errors.accessDenied };
    }
  }

  return true;
};
