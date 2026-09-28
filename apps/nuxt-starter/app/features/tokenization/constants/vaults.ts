/** Vault types accepted by the vaults list filter. Values must match the backend enum. */
export const VAULT_TYPES = {
  API_SEGREGATED: 'API_SEGREGATED',
  API_CONSOLIDATED: 'API_CONSOLIDATED',
  INTERNAL: 'INTERNAL',
} as const;
