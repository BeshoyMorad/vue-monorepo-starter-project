import type { RouteLocationNormalized } from 'vue-router';

/**
 * Resolves the locale of a route from its URL prefix (e.g. /ar/...), falling back to the
 * default locale. Use it in route middleware, where the i18n locale may not be switched yet.
 */
export function getRouteLocale(route: Pick<RouteLocationNormalized, 'path'>) {
  const i18n = useNuxtApp().$i18n;
  const prefix = route.path.split('/')[1];
  return i18n.localeCodes.value.find((code) => code === prefix) ?? i18n.defaultLocale;
}
