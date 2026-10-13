import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAuthRedirect } from '@workspace/core/composables/useAuthRedirect';
import { paths } from '@/router/paths';

export const createAuthGuard = (loginRouteName: string = paths.auth.login) => {
  return (to: RouteLocationNormalized): NavigationGuardReturn => {
    const authStore = useAuthStore();
    const { saveRedirectUrl } = useAuthRedirect();

    if (!authStore.isAuthenticated) {
      saveRedirectUrl(to.fullPath);
      return { name: loginRouteName };
    }
    return true;
  };
};

export const authGuard = createAuthGuard();
