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

export type ContactChannel = 'phone' | 'email';

/** POST customers/current-user/contact: sends a code to the new phone / email */
export interface ContactChangeRequest {
  channel: ContactChannel;
  identifier: string;
  portal?: string;
}

/** Step 1 of an OTP-confirmed change: the token step 2 sends back with the code */
export interface ChangeTokenResponse {
  token: string;
  success: boolean;
}

/** PUT …/contact and …/iban: confirms the change with the 6-digit code */
export interface ConfirmChangeRequest {
  token: string;
  otp: string;
}

/** Insurance policies / trips of the customer, by status */
export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

export type StatsDomain = 'insurance' | 'transportation';
