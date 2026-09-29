// import { useAuthStore } from '@/stores/auth';
import type { CanPermission } from '@/types/auth';

function parseDotNotation(permStr: string): [string, string] {
  const [resource = '', ...action] = permStr.split('.');
  return [resource, action.join('.')];
}

function hasPermission(
  permissions: Record<string, string[]>,
  resource: string,
  action: string
): boolean {
  return permissions[resource]?.includes(action) ?? false;
}

export const usePermissionStore = defineStore('permissions', () => {
  // const authStore = useAuthStore();

  // const permissions = computed(() => authStore.authEmployee?.role?.permissions || {});
  const permissions = computed(() => ({
    admins: ['list'],
  }));

  const can = (perms: CanPermission, operator: 'or' | 'and' = 'or'): boolean => {
    const list = Array.isArray(perms) ? perms : [perms];
    if (list.length === 0) return true;

    const checks = list.map((p) => {
      const [resource, action] = parseDotNotation(p);
      return hasPermission(permissions.value, resource, action);
    });

    if (operator === 'or') {
      return checks.some(Boolean);
    }
    return checks.every(Boolean);
  };

  return {
    permissions,
    can,
  };
});
