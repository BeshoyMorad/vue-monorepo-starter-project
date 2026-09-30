import { defineStore } from 'pinia';
import { computed } from 'vue';
import { checkRoutePermission } from '@workspace/core/router/guards/checkRoutePermission';

export const usePermissionStore = defineStore('permissions', () => {
  const permissions = computed<Record<string, string[]>>(() => ({
    admin: ['list', 'detailed_view', 'create', 'update', 'delete'],
  }));

  const can = (perms: CanPermission<Models>, operator: 'or' | 'and' = 'or'): boolean => {
    return checkRoutePermission(permissions.value, perms, operator);
  };

  return {
    permissions,
    can,
  };
});
