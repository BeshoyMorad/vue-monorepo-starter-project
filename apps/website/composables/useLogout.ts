import { useQueryClient } from '@tanstack/vue-query';
import { useAuthService } from '~/modules/auth/services';
import { paths } from '~/router/paths';
import { useAuthStore } from '~/stores/auth';
import { usePermissionStore } from '~/stores/permissions';

/**
 * True from the sign-out click until the login page is shown. The header keeps its
 * "Sign out" item (as "Signing out…") meanwhile: the session is cleared before the login
 * page has loaded, so it would otherwise flash "Sign in" in between.
 */
export const useSigningOut = () => useState('auth-signing-out', () => false);

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
  const signingOut = useSigningOut();
  const nuxtApp = useNuxtApp();

  return async () => {
    if (signingOut.value) return;
    signingOut.value = true;
    try {
      if (authStore.isAuthenticated) {
        await service.logout().catch(() => undefined);
      }
      authStore.clearSession();
      permissionStore.$reset();
      queryClient.clear();
      // The URL changes while the old layout is still on screen (the login page has an enter
      // transition). The header resets the flag when it unmounts; this is the fallback.
      nuxtApp.hooks.hookOnce('page:transition:finish', () => {
        signingOut.value = false;
      });
      await navigateTo(localePath(paths.auth.login));
    } catch (error) {
      signingOut.value = false;
      throw error;
    }
  };
}
