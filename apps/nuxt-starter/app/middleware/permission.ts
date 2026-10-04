import { paths } from '@/constants/route-names';

/**
 * Named middleware for pages that need specific permissions. Usage:
 *
 *   definePageMeta({
 *     middleware: ['permission'],
 *     permissions: ['admins.list', 'admins.create'],
 *     permissionsOperator: 'and', // optional, defaults to 'or'
 *   });
 *
 * Users without the permissions are redirected to the access-denied page.
 * It redirects instead of aborting because an abort on first load shows a 404.
 */
export default defineNuxtRouteMiddleware((to) => {
  const required = to.meta.permissions;
  if (!required) return;

  const permissionStore = usePermissionStore();
  if (permissionStore.can(required, to.meta.permissionsOperator)) return;

  return navigateTo({ name: paths.errors.accessDenied });
});
