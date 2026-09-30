/**
 * TanStack Query key registry for the website. Build keys from here so that
 * invalidation (`queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })`)
 * always targets exactly the queries it should.
 */
export const queryKeys = {
  auth: {
    profile: () => ['auth', 'profile'] as const,
  },
  users: {
    all: () => ['users'] as const,
    details: (id: string | number) => [...queryKeys.users.all(), 'details', id] as const,
  },
} as const;
