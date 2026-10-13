import { createAppRouter, createBaseRoutes } from '@workspace/core/router';
import { handleOffline } from '@workspace/core/composables';
import { paths } from './paths';
import { authGuard, permissionGuard } from './guards';
import { authRoutes } from '@/modules/auth/auth.routes';
import { componentsRoutes } from '@/modules/doc/components/components.routes';
import { formsRoutes } from '@/modules/doc/forms/forms.routes';
import { composablesRoutes } from '@/modules/doc/composables/composables.routes';
import { docRoutes } from '@/modules/doc/documentation/doc.routes';

export const domainRoutes = [
  ...authRoutes,
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

export const router = createAppRouter({
  domainRoutes,
  baseRoutes: createBaseRoutes(),
  defaultTitle: 'Base Template',
  onOffline: handleOffline,
  permissionGuard,
});

export default router;
