import { useQueryClient } from '@tanstack/vue-query';
import { useAuthService } from '~/modules/auth/services';
import { paths } from '~/router/paths';
import { useAuthStore } from '~/stores/auth';
import { usePermissionStore } from '~/stores/permissions';

/**
 * Signs out: revokes the session on the backend, then clears token, user, permissions
 * and cached queries locally and goes to login. The local cleanup runs even if the
 * backend call fails (e.g. the session had already expired).
 */
export function useLogout() {
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();
  const queryClient = useQueryClient();
  const localePath = useLocalePath();
  const service = useAuthService();

  return async () => {
    if (authStore.isAuthenticated) {
      await service.logout().catch(() => undefined);
    }
    authStore.clearSession();
    permissionStore.$reset();
    queryClient.clear();
    await navigateTo(localePath(paths.auth.login));
  };
}
