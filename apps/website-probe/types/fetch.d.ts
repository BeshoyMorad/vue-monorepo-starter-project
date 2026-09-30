import type { ResponseType } from 'ofetch';

declare module 'ofetch' {
  // Type parameters must match ofetch's declaration for the augmentation to merge
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  interface FetchOptions<R extends ResponseType = ResponseType, T = any> {
    /**
     * Suppress the global error toast for this request.
     * Use it when the caller renders the error itself (e.g. inline form errors).
     */
    silent?: boolean;
    /**
     * Skip the global 401 handling (session clear + redirect to login).
     * Use it for auth endpoints where 401 means "wrong credentials", not "session expired".
     */
    skipAuthRedirect?: boolean;
  }
}

export {};
