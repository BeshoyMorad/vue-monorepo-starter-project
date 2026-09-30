import type { RouteRecordRaw } from 'vue-router';

const byOrder = (a: RouteRecordRaw, b: RouteRecordRaw): number =>
  (a.meta?.order ?? Number.POSITIVE_INFINITY) - (b.meta?.order ?? Number.POSITIVE_INFINITY);

/** Top-level routes that render as sidebar sections (they need `sidebar: true` and children). */
export function getSidebarSections(routes: readonly RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.filter((route) => route.meta?.sidebar && route.children?.length).sort(byOrder);
}

/** Child routes of a section that should appear as links, in `order`. */
export function getSidebarLinks(section: RouteRecordRaw): RouteRecordRaw[] {
  return (section.children ?? []).filter((child) => child.meta?.sidebar === true).sort(byOrder);
}
