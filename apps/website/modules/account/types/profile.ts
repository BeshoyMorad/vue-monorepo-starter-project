import type { UserGrant } from '~/types/auth';

/** GET / PATCH customers/current-user/profile */
export interface CustomerProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  avatar: string | null;
  nationalId?: string | null;
  addressLink?: string | null;
  /** Not in the profile docs, but on the customer record; shown when the API sends it */
  iban?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string | null;
  grants?: UserGrant[];
  sessionId?: string;
}

/** PATCH body: only the changed fields. `avatar: null` clears it. */
export interface UpdateProfileRequest {
  fullName?: string;
  nationalId?: string;
  addressLink?: string;
  avatar?: string | null;
}
