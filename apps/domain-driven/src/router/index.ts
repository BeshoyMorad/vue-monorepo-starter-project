import { createAppRouter, createBaseRoutes } from '@workspace/core/router';
import { handleOffline } from '@workspace/core/composables';
import { adminRoutes } from '@/domains/admin/admin.routes';
import { supplierRoutes } from '@/domains/supplier/supplier.routes';
import { authRoutes } from '@/domains/auth/auth.routes';

export const domainRoutes = [
  // ── Default Root ────────────────────────────────────────────────────────
  {
    path: '/',
    redirect: '/admin',
  },

  // ── Auth ────────────────────────────────────────────────────────────────
  ...authRoutes,

  // ── Domain Portals (Route-level Code Splitting) ──────────────────────────
  ...adminRoutes,
  ...supplierRoutes,
];

export const router = createAppRouter({
  domainRoutes,
  baseRoutes: createBaseRoutes(),
  defaultTitle: 'Domain Driven Starter',
  onOffline: handleOffline,
});

export default router;
