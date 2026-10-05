/**
 * TanStack Query key registry for the website. Build keys from here so that
 * invalidation (`queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })`)
 * always targets exactly the queries it should.
 */
export const queryKeys = {
  auth: {
    profile: () => ['auth', 'profile'] as const,
  },
  account: {
    all: () => ['account'] as const,
    profile: () => [...queryKeys.account.all(), 'profile'] as const,
    stats: (domain: string) => [...queryKeys.account.all(), 'stats', domain] as const,
  },
  search: {
    all: () => ['search'] as const,
    results: (params: object) => [...queryKeys.search.all(), 'results', params] as const,
    suggestions: (q: string, locale: string) =>
      [...queryKeys.search.all(), 'suggestions', q, locale] as const,
    history: () => [...queryKeys.search.all(), 'history'] as const,
  },
  users: {
    all: () => ['users'] as const,
    details: (id: string | number) => [...queryKeys.users.all(), 'details', id] as const,
  },
} as const;
