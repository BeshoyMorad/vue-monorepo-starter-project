import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router';
import { checkRoutePermission } from './checkRoutePermission';
import { basePaths } from '@workspace/core/router/paths';

export const createPermissionGuard = (getPermissions: () => Record<string, string[]>) => {
  return (to: RouteLocationNormalized): NavigationGuardReturn => {
    const requiredPermission = to.meta?.permission as string | string[] | undefined;
    if (!requiredPermission) return true;

    const permissions = getPermissions();
    const operator = (to.meta?.permissionOperator as 'or' | 'and') || 'or';
    const allowed = checkRoutePermission(permissions, requiredPermission, operator);

    if (!allowed) {
      return { name: basePaths.errors.accessDenied };
    }
    return true;
  };
};
