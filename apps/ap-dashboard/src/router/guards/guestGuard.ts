import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export const guestGuard = (
  _to: RouteLocationNormalized,
  from: RouteLocationNormalized
): NavigationGuardReturn => {
  const authStore = useAuthStore();
  return authStore.isAuthenticated ? from : true;
};
