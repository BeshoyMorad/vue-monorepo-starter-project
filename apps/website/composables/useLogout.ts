import { useQueryClient } from '@tanstack/vue-query';
import { paths } from '~/router/paths';
import { useAuthStore } from '~/stores/auth';
import { usePermissionStore } from '~/stores/permissions';

/**
 * Ends the session locally: clears token, user, permissions and cached queries,
 * then goes to login. Call the backend logout endpoint before this once it exists.
 */
export function useLogout() {
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();
  const queryClient = useQueryClient();
  const localePath = useLocalePath();

  return async () => {
    authStore.clearSession();
    permissionStore.$reset();
    queryClient.clear();
    await navigateTo(localePath(paths.auth.login));
  };
}
