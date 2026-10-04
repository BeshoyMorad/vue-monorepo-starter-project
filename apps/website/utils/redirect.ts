/**
 * Returns `value` when it is a safe in-app path, otherwise null.
 * Blocks open redirects such as `//evil.com` or `https://evil.com`.
 */
export function getSafeRedirect(value: unknown): string | null {
  const target = Array.isArray(value) ? value[0] : value;
  if (typeof target !== 'string' || !target.startsWith('/')) {
    return null;
  }
  if (target.startsWith('//') || target.startsWith('/\\')) {
    return null;
  }
  return target;
}
