/**
 * Authenticated user as returned by the backend.
 * Replace the loose fields with the real shape once the profile endpoint is known.
 */
export interface AuthUser {
  id: number | string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}
