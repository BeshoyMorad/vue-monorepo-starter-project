import { basePaths } from '@workspace/core/router/paths';

export const paths = {
  home: '/',
  dashboard: '/dashboard',
  ssgExample: '/ssg-example',
  isrExample: '/isr-example',
  // Same URLs as ibbil.com
  auth: {
    login: `/auth/${basePaths.auth.login}`,
    register: '/auth/register',
    verify: '/auth/verify',
    forgotPassword: `/auth/${basePaths.auth.forgotPassword}`,
  },
  errors: {
    notFound: `/${basePaths.errors.notFound}`,
    accessDenied: `/${basePaths.errors.accessDenied}`,
    serverError: `/${basePaths.errors.serverError}`,
    noInternet: `/${basePaths.errors.noInternet}`,
  },
} as const;

export type WebsitePaths = typeof paths;
export default paths;
