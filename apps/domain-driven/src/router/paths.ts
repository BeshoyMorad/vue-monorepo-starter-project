export const paths = {
  auth: {
    login: 'auth.login',
  },
  admin: {
    root: 'admin.dashboard',
  },
  supplier: {
    root: 'supplier.dashboard',
  },
  errors: {
    accessDenied: 'errors.access-denied',
    serverError: 'errors.internal-server-error',
    noInternet: 'errors.no-internet',
    notFound: 'errors.not-found',
  },
} as const;
