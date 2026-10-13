export const basePaths = {
  errors: {
    notFound: 'not-found',
    accessDenied: 'access-denied',
    serverError: 'server-error',
    noInternet: 'no-internet',
  },
} as const;

export type BasePaths = typeof basePaths;
