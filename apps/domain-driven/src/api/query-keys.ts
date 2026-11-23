import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { authKeys } from '@/domains/auth/auth.keys';

/**
 * Registry for app-wide TanStack Query keys (auth).
 * Domains keep their own keys in `domains/<domain>/<domain>.keys.ts` (createQueryKeys)
 * and use them directly, so domains stay isolated from each other.
 */
export const queryKeys = mergeQueryKeys(authKeys);
