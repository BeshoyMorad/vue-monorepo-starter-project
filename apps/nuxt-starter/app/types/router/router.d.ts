import type { CanPermission } from '@/types/auth';

/** Custom route meta used by the sidebar, overview cards, document title and middleware. */
interface AppRouteMeta {
  /** Page title, also used for `<title>` and navigation labels. */
  title?: string;
  /** Show this route in the sidebar and overview cards. */
  sidebar?: boolean;
  /** Iconify class shown next to a sidebar section. */
  icon?: string;
  /** Sort position among sibling routes in the sidebar. Lower comes first. */
  order?: number;
  /** Set to `false` to make the page public. Checked by `middleware/auth.global.ts`. */
  auth?: boolean;
  /** Permissions required by `middleware/permission.ts`. */
  permissions?: CanPermission;
  /** How `permissions` are combined. Defaults to `'or'`. */
  permissionsOperator?: 'or' | 'and';
}

declare module '#app' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PageMeta extends AppRouteMeta {}
}

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouteMeta extends AppRouteMeta {}
}

export {};
