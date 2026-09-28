import { guestGuard } from '@workspace/core/router';
import { paths } from '@/router/paths';
import type { RouteRecordRaw } from 'vue-router';

export const authRoutes = [
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    beforeEnter: [guestGuard],
    children: [
      {
        path: 'login',
        name: paths.auth.login,
        component: () => import('./Login.vue'),
        meta: {
          title: 'Sign In',
          sidebar: false,
        },
      },
    ],
  },
] as RouteRecordRaw[];
