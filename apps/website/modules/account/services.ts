import type { ApiFetch, ApiFetchOptions } from '~/api/client';
import { apiRoute, type WebsiteApiRoutes } from '~/api/endpoints';
import type { ApiEnvelope } from '~/types/api';
import type {
  ChangeTokenResponse,
  ConfirmChangeRequest,
  ContactChangeRequest,
  CustomerProfile,
  CustomerStats,
  StatsDomain,
  UpdateProfileRequest,
} from './types';

type RouteName = Extract<keyof WebsiteApiRoutes, string>;

/**
 * Endpoints of the signed-in customer's account. Every call returns the envelope's `data`;
 * failures throw a FetchError. Calls are `silent`: the account page shows errors inline.
 */
export function createAccountService(api: ApiFetch) {
  const call = async <T>(name: RouteName, options: ApiFetchOptions = {}) =>
    (await api<ApiEnvelope<T>>(apiRoute(name), { silent: true, ...options })).data;

  return {
    profile: (signal?: AbortSignal) => call<CustomerProfile>('customer.profile', { signal }),

    updateProfile: (body: UpdateProfileRequest) =>
      call<CustomerProfile>('customer.profile', { method: 'PATCH', body }),

    /** Sends a code to the new phone or email; confirm with `confirmContactChange` */
    requestContactChange: (body: ContactChangeRequest) =>
      call<ChangeTokenResponse>('customer.contact', { method: 'POST', body }),

    confirmContactChange: (body: ConfirmChangeRequest) =>
      call<{ success: boolean }>('customer.contact', { method: 'PUT', body }),

    /** Sends a code to the registered phone; confirm with `confirmIbanChange` */
    requestIbanChange: (iban: string) =>
      call<ChangeTokenResponse>('customer.iban', { method: 'POST', body: { iban } }),

    confirmIbanChange: (body: ConfirmChangeRequest) =>
      call<{ success: boolean }>('customer.iban', { method: 'PUT', body }),

    deleteAccount: () => call<{ success: boolean }>('customer.delete', { method: 'DELETE' }),

    stats: (domain: StatsDomain, signal?: AbortSignal) =>
      call<CustomerStats>(
        domain === 'insurance' ? 'customer.stats.insurance' : 'customer.stats.transportation',
        { signal }
      ),
  };
}

export type AccountService = ReturnType<typeof createAccountService>;

/** Account service bound to the app's fetch client. */
export const useAccountService = (): AccountService => createAccountService(useApi());
