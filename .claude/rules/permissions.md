---
paths:
  - "apps/*/src/stores/permissions.ts"
  - "apps/*/src/router/guards/**"
  - "packages/core/src/router/guards/**"
  - "apps/*/src/**/*.vue"
---

# Permissions

- Permissions are `resource.action` strings, for example `users.list`.
- In components and stores, use `usePermissionStore().can` from the app's `@/stores/permissions` and call `can('resource.action')`. Do not re-parse permission strings by hand.
- `can()` takes an optional operator for multiple permissions: `can(['a.list', 'b.list'], 'and')`. The default is `'or'`.
- Templates hide or disable controls with `v-if="can('...')"`. Keep the UI safe when `can` is false.
- Protect routes too, not only buttons. Set `meta.permission` (and `meta.permissionOperator`) on the route. The app's `permissionGuard` is built from `createPermissionGuard` in `@workspace/core/router/guards` and redirects to the access-denied route.
- Known gap: the store's `permissions` is a hardcoded demo set (`admin`, `users`), not derived from the authenticated user's role. Treat it as a placeholder until that is wired.
