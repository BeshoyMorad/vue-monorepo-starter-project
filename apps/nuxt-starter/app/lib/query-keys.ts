/**
 * Global registry for all Tanstack Query Keys.
 * Use these constants/functions to avoid typos and ensure invalidations target the exact query.
 */
export const QUERY_KEYS = {
  auth: {
    profile: () => ['auth.profile'] as const,
  },

  users: {
    all: () => ['users'] as const,
    list: () => [...QUERY_KEYS.users.all(), 'list'] as const,
    details: (id: number | string) => [...QUERY_KEYS.users.all(), 'details', String(id)] as const,
  },
  corporates: {
    all: () => ['corporates'] as const,
    list: () => [...QUERY_KEYS.corporates.all(), 'list'] as const,
    details: (id: number | string) =>
      [...QUERY_KEYS.corporates.all(), 'details', String(id)] as const,
  },
  starter: {
    all: () => ['starter'] as const,
    profile: () => [...QUERY_KEYS.starter.all(), 'profile'] as const,
  },
  networks: {
    all: () => ['networks'] as const,
    list: () => [...QUERY_KEYS.networks.all(), 'list'] as const,
  },
  assets: {
    all: () => ['assets'] as const,
    list: () => [...QUERY_KEYS.assets.all(), 'list'] as const,
    allAssets: () => [...QUERY_KEYS.assets.all(), 'all-assets'] as const,
  },
  tokenization: {
    all: () => ['tokenization'] as const,
    list: () => [...QUERY_KEYS.tokenization.all(), 'list'] as const,
    detail: (id: number | string) =>
      [...QUERY_KEYS.tokenization.all(), 'detail', String(id)] as const,
    networks: () => [...QUERY_KEYS.tokenization.all(), 'networks'] as const,
  },
  gasStation: {
    all: () => ['gas-station'] as const,
    categories: () => [...QUERY_KEYS.gasStation.all(), 'categories'] as const,
  },
  vaults: {
    all: () => ['vaults'] as const,
    list: () => [...QUERY_KEYS.vaults.all(), 'list'] as const,
  },
} as const;
