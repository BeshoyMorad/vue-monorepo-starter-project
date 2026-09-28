export const basePaths = {
  auth: {
    login: 'login',
    logout: 'logout',
    forgotPassword: 'forgot-password',
  },
  system: {
    dashboard: 'dashboard',
    settings: 'settings',
    profile: 'profile',
  },
  errors: {
    notFound: 'not-found',
    accessDenied: 'access-denied',
    serverError: 'server-error',
    noInternet: 'no-internet',
  },
} as const;

export type BasePaths = typeof basePaths;
