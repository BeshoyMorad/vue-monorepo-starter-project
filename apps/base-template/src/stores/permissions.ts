import { defineStore } from 'pinia';
import { computed } from 'vue';
import { checkRoutePermission } from '@workspace/core/router/guards/checkRoutePermission';

export const usePermissionStore = defineStore('permissions', () => {
  const permissions = computed<Record<string, string[]>>(() => ({
    admin: ['list', 'detailed_view', 'create', 'update', 'delete'],
    users: ['list', 'detailed_view'],
  }));

  const can = (perms: CanPermission<Models>, operator: 'or' | 'and' = 'or'): boolean => {
    return checkRoutePermission(permissions.value, perms as string | string[], operator);
  };

  return {
    permissions,
    can,
  };
});
