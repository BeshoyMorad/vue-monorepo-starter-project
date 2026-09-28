/** Custom route meta used by the sidebar, overview cards and document title. */
interface AppRouteMeta {
  /** Page title, also used for `<title>` and navigation labels. */
  title?: string;
  /** Show this route in the sidebar and overview cards. */
  sidebar?: boolean;
  /** Iconify class shown next to a sidebar section. */
  icon?: string;
  /** Sort position among sibling routes in the sidebar. Lower comes first. */
  order?: number;
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
