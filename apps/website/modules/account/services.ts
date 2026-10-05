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

    /** Uploads one image and returns its public URL (then saved with `updateProfile`) */
    uploadImage: async (file: File) => {
      const body = new FormData();
      body.append('file', file);
      const data = await call<unknown>('uploads.image', { method: 'POST', body });
      const url = pickUploadUrl(data);
      if (!url) throw new Error('UPLOAD_NO_URL');
      return url;
    },

    deleteAccount: () => call<{ success: boolean }>('customer.delete', { method: 'DELETE' }),

    stats: (domain: StatsDomain, signal?: AbortSignal) =>
      call<CustomerStats>(`customer.stats.${domain}`, { signal }),
  };
}

/**
 * The URL in an upload response. Only the request side was verified against the dev API
 * (field `file`, codes UPLOAD_FILE_REQUIRED / UPLOAD_FILE_TYPE_UNSUPPORTED), so the common
 * response shapes are all accepted: a string, { url | location | fileUrl | path }, or a list.
 */
function pickUploadUrl(data: unknown): string | undefined {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return pickUploadUrl(data[0]);
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const value = record.url ?? record.location ?? record.fileUrl ?? record.path ?? record.file;
    return typeof value === 'string' ? value : pickUploadUrl(value);
  }
  return undefined;
}

export type AccountService = ReturnType<typeof createAccountService>;

/** Account service bound to the app's fetch client. */
export const useAccountService = (): AccountService => createAccountService(useApi());
