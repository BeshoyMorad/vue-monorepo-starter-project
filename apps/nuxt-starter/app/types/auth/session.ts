/** Tokens and user returned by the login endpoint and kept in the auth store. */
export interface AuthSession {
  access_token: string;
  refresh_token: string;
  user: unknown;
}
