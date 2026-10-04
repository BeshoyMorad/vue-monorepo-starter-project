/** A token with its expiry (ISO date string), as returned by the Ibbil API. */
export interface AuthToken {
  value: string;
  expiresIn: string;
}

export interface AuthTokens {
  accessToken: AuthToken;
  refreshToken: AuthToken;
}

export interface UserGrant {
  domain: string;
  role: string;
  tenantId: string;
  tenantAs: string;
  permissions: string[];
}

/** Authenticated user as returned by login / contact verification. */
export interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  avatar: string | null;
  addressLink?: string | null;
  nationalId?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  grants?: UserGrant[];
}

/**
 * The part of the user kept in the session cookie. Grants and other large fields are
 * left out to stay well under the 4 KB cookie limit.
 */
export type SessionUser = Pick<
  AuthUser,
  'id' | 'fullName' | 'phone' | 'email' | 'avatar' | 'emailVerified' | 'phoneVerified'
>;

/** Successful login / verification payload. */
export interface AuthSession {
  tokens: AuthTokens;
  user: AuthUser;
}
