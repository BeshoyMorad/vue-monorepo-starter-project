import type { ApiFetch } from '~/api/client';
import { apiRoute } from '~/api/endpoints';
import type { ApiEnvelope } from '~/types/api';
import type { PlatformStats } from './types';

/** Homepage endpoints. Silent: the sections show their own fallback. */
export function createHomeService(api: ApiFetch) {
  return {
    platformStats: async (signal?: AbortSignal) =>
      (await api<ApiEnvelope<PlatformStats>>(apiRoute('stats.platform'), { signal, silent: true }))
        .data,
  };
}

export type HomeService = ReturnType<typeof createHomeService>;

export const useHomeService = (): HomeService => createHomeService(useApi());
