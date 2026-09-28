/* eslint-disable max-lines-per-function */
import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue';
import { formatNumber } from '@/utils/formatter';
import { gasStationService } from '@/features/tokenization/services/gas-station';
import type { GasStationWallet } from '@/features/tokenization/types';

const POLLING_INTERVAL_MS = 5000;

/**
 * Composable that polls the Gas Station wallet balance every 5 seconds
 * when both networkId and gasStationCategoryId are selected.
 * Automatically cleans up its interval timer on unmount to prevent memory leaks.
 *
 * @param networkId - Reactive ref of the selected Network ID.
 * @param gasStationCategoryId - Reactive ref of the selected Gas Station Category ID.
 */
export function useGasStationPolling(
  networkId: Ref<number | undefined>,
  gasStationCategoryId: Ref<number | undefined>
) {
  const maxBalance = ref<GasStationWallet[] | null>(null);
  const isLoading = ref(false);
  const intervalId = ref<number | null>(null);

  const fetchBalance = async () => {
    const netId = networkId.value;
    const catId = gasStationCategoryId.value;

    if (!netId || !catId) {
      maxBalance.value = null;
      return;
    }

    try {
      isLoading.value = true;
      const res = await gasStationService.getWallets({
        targetId: catId,
        networkId: netId,
      });
      maxBalance.value = res.data ?? null;
    } catch {
      maxBalance.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const stopPolling = () => {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  };

  const startPolling = async () => {
    stopPolling();
    if (networkId.value && gasStationCategoryId.value) {
      await fetchBalance();
      intervalId.value = window.setInterval(fetchBalance, POLLING_INTERVAL_MS);
    } else {
      maxBalance.value = null;
    }
  };

  watch([networkId, gasStationCategoryId], () => {
    startPolling();
  });

  onMounted(() => {
    if (networkId.value && gasStationCategoryId.value) {
      startPolling();
    }
  });

  onUnmounted(() => {
    stopPolling();
  });

  const availableBalanceText = computed(() => {
    if (!gasStationCategoryId.value || !networkId.value) return '';
    const item = maxBalance.value?.[0];
    if (item) {
      return `${formatNumber(Number(item.balance), { maximumFractionDigits: 6 })} ${item.asset.symbol}`;
    }
    return 'No Available Balance';
  });

  return {
    maxBalance,
    availableBalanceText,
    isLoading,
    refetchBalance: fetchBalance,
  };
}
