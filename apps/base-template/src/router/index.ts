import { createAppRouter, createBaseRoutes, authGuard } from '@workspace/core/router';
import { handleOffline } from '@workspace/core/composables';
import { paths } from './paths';
import { componentsRoutes } from '@/modules/doc/components/components.routes';
import { formsRoutes } from '@/modules/doc/forms/forms.routes';
import { composablesRoutes } from '@/modules/doc/composables/composables.routes';
import { docRoutes } from '@/modules/doc/documentation/doc.routes';
import { defaultErrorComponents } from '@workspace/ui';

export const domainRoutes = [
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    beforeEnter: [authGuard],
    children: [
      {
        path: '',
        name: paths.dashboard.root,
        component: () => import('@/modules/doc/documentation/pages/index.vue'),
        meta: { title: 'Dashboard' },
      },
      ...docRoutes,
      ...componentsRoutes,
      ...formsRoutes,
      ...composablesRoutes,
    ],
  },
];

export const baseRoutes = createBaseRoutes({
  authLayout: () => import('@/layouts/AuthLayout.vue'),
  loginComponent: () => import('@/modules/auth/Login.vue'),
  ...defaultErrorComponents,
});

export const router = createAppRouter({
  domainRoutes,
  baseRoutes,
  defaultTitle: 'Base Template',
  onOffline: handleOffline,
});

export default router;
