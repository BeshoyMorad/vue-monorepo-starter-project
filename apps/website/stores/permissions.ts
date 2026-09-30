import { defineStore } from 'pinia';
import { ref } from 'vue';
import { checkRoutePermission } from '@workspace/core/router/guards/checkRoutePermission';

/**
 * User permissions keyed by model, e.g. { orders: ['list', 'create'] }.
 * Fill it from the backend (profile / login response) with `setPermissions`.
 */
export const usePermissionStore = defineStore('permissions', () => {
  // Demo permissions used by the dashboard example. Replace with backend data via setPermissions.
  const permissions = ref<Record<string, string[]>>({
    admin: ['list', 'detailed_view', 'create', 'update', 'delete'],
  });

  const setPermissions = (value: Record<string, string[]>) => {
    permissions.value = value;
  };

  const can = (perms: CanPermission<Models>, operator: 'or' | 'and' = 'or'): boolean =>
    checkRoutePermission(permissions.value, perms, operator);

  const $reset = () => {
    permissions.value = {};
  };

  return { permissions, setPermissions, can, $reset };
});
