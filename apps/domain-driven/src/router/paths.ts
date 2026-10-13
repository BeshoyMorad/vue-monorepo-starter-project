import { basePaths } from '@workspace/core/router';

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
  errors: basePaths.errors,
} as const;
