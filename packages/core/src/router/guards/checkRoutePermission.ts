/**
 * Pure, framework-agnostic permission engine.
 * Can be used in Vue Router navigation guards, Nuxt route middleware,
 * Pinia stores, or standalone utility functions.
 */

export function parseDotNotation(permStr: string): [string, string] {
  const parts = permStr.split('.');
  return [parts[0], parts.slice(1).join('.')];
}

export function hasPermission(
  permissions: Record<string, string[]>,
  resource: string,
  action: string
): boolean {
  return permissions[resource]?.includes(action) ?? false;
}

export function checkRoutePermission(
  userPermissions: Record<string, string[]>,
  requiredPermission: string | string[],
  operator: 'or' | 'and' = 'or'
): boolean {
  const list = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
  if (list.length === 0) return true;

  const checks = list.map((p) => {
    const [resource, action] = parseDotNotation(p);
    return hasPermission(userPermissions, resource, action);
  });

  if (operator === 'or') {
    return checks.some(Boolean);
  }
  return checks.every(Boolean);
}
