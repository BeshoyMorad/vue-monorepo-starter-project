---
paths:
  - "apps/*/src/router/**"
  - "apps/*/src/modules/**/*.routes.ts"
  - "apps/*/src/modules/**/*.paths.ts"
  - "packages/core/src/router/**"
---

# Routing

- Route names are constants. Import `paths` from the app's `@/router/paths` and use `{ name: paths.<area>.<route> }` in `router.push`, `RouterLink`, and guards. Never write raw path strings for navigation.
- Each module exports a `<feature>.paths.ts` (nested object of names) and a `<feature>.routes.ts` (`RouteRecordRaw[]`). Spread the paths into `paths` in `apps/<app>/src/router/paths.ts`, and spread the routes into the app router in `apps/<app>/src/router/index.ts`.
- Shared route names and the router factory (`createAppRouter`, `createBaseRoutes`, `basePaths`) come from `@workspace/core/router`. Change them there only when every app should get the change.
- Lazy-load every page: `component: () => import('./Login.vue')` or `() => import('@/modules/<feature>/pages/...')`.
- Guards live in `apps/<app>/src/router/guards/`. App routes use `authGuard`, auth screens use `guestGuard`, and `permissionGuard` is built with `createPermissionGuard` from core.
- Set `meta.title` on every route. Set `meta.permission` (and `meta.permissionOperator` for several) on routes that need a permission. Set `meta.sidebar: false` on screens without the app shell, such as the error pages.
- Error routes come from `basePaths.errors`. The API client redirects to them on 403 and 500, so keep those names.
