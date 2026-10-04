import { type Ref } from 'vue';
import { error as toastError } from '@/utils/toast';
import { vaultsServices } from '@/features/tokenization/services/vaults';
import { useFormContext } from 'vee-validate';
import type { CreateTokenFormValues } from '@/features/tokenization/types';

/**
 * Composable that watches the selected vaultId and resolves the owner public address
 * for the selected network from the backend master wallet endpoint.
 *
 * @param vaultId - Reactive ref to the chosen Vault ID.
 * @param networkId - Reactive ref to the chosen Network ID.
 * @param setFieldValue - Callback from VeeValidate form to update the ownerAddress field value.
 * @param resetField - Callback to reset/clear the ownerAddress field on error.
 */
export function useVaultOwnerResolve(
  vaultId: Ref<number | undefined>,
  networkId: Ref<number | undefined>
) {
  const { setFieldValue, resetField } = useFormContext<CreateTokenFormValues>();

  const isResolving = ref(false);

  watch(vaultId, async (newVaultId) => {
    const netId = networkId.value;

    if (!newVaultId || !netId) return;

    try {
      isResolving.value = true;

      const { data: wallets } = await vaultsServices.getMasterWallets(newVaultId, {
        networkId: netId,
        targetId: newVaultId,
      });

      const wallet = wallets[0];
      if (wallet) {
        setFieldValue('ownerAddress', wallet.publicAddress);
      } else {
        toastError('No coin wallet found for this network in this vault');
        resetField('ownerAddress');
      }
    } catch {
      toastError('Failed to resolve owner address for selected vault');
      resetField('ownerAddress');
    } finally {
      isResolving.value = false;
    }
  });

  return {
    isResolving,
  };
}
