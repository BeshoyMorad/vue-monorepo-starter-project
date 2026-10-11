import { useQuery } from '@tanstack/vue-query';
import { walletQueryOptions } from '~/modules/wallet/queries';
import { useWalletService } from '~/modules/wallet/services';
import { useAuthStore } from '~/stores/auth';

/** The signed-in customer's wallet (balance, status, currency) */
export function useWallet() {
  const service = useWalletService();
  const authStore = useAuthStore();
  return useQuery(computed(() => walletQueryOptions(service, authStore.isAuthenticated)));
}
