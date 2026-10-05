import { useQuery } from '@tanstack/vue-query';
import { profileQueryOptions } from '~/modules/account/queries';
import { useAccountService } from '~/modules/account/services';
import { useAuthStore } from '~/stores/auth';

/**
 * The signed-in customer's profile. Each fresh copy also updates the user kept in the
 * session cookie, so the header shows the current name everywhere.
 */
export function useAccountProfile() {
  const service = useAccountService();
  const authStore = useAuthStore();
  const query = useQuery(computed(() => profileQueryOptions(service, authStore.isAuthenticated)));
  watch(
    () => query.data.value,
    (profile) => profile && authStore.setUser(profile)
  );
  return query;
}
