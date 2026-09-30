import { basePaths } from '@workspace/core/router/paths';

export const paths = {
  home: '/',
  dashboard: '/dashboard',
  ssgExample: '/ssg-example',
  isrExample: '/isr-example',
  auth: {
    login: `/${basePaths.auth.login}`,
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
