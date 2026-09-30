import { usePermissionStore } from '~/stores/permissions';

/**
 * Blocks a page unless the user has the permission(s) declared in page meta.
 * Usage: definePageMeta({ middleware: ['auth', 'permission'], permission: 'orders.list' })
 */
export default defineNuxtRouteMiddleware((to) => {
  const required = to.meta.permission;
  if (!required) {
    return;
  }

  const permissionStore = usePermissionStore();
  if (permissionStore.can(required, to.meta.permissionOperator ?? 'or')) {
    return;
  }

  return abortNavigation(createError({ statusCode: 403, statusMessage: 'Forbidden' }));
});
