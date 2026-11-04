---
name: new-feature
description: Scaffold a new feature in a monorepo app (apps/base-template module or apps/domain-driven domain), deciding what belongs in an app versus a @workspace package. Use when asked to add a screen, section, or business feature.
---

# New feature (monorepo)

1. **Pick the app.** `apps/base-template` (modules), `apps/domain-driven` (domains), or `apps/website` (Nuxt, file-based pages). Confirm with the user if unclear. Do not touch other apps.
2. **App-only or shared?** Feature screens, routes, services, schemas, and stores stay in the app. Only generic, SSR-safe logic needed by a second app goes in `packages/core`; shared components go in `packages/ui`; shared text in `packages/locales`. If you move something into a package, update every app that had a copy.
3. **base-template.** Mirror `apps/base-template/src/modules/auth` and `starter`: `<feature>.routes.ts`, `<feature>.paths.ts`, `pages/`, `components/`, `composables/`, `services/index.ts`, `schemas/`, `types.ts`. Spread paths into `src/router/paths.ts` and routes into `src/router/index.ts`.
4. **domain-driven.** Run `pnpm --filter @workspace/domain-driven create:domain <name>`, then register the routes in the app router and set `meta.allowedDomains`. A domain never imports another domain.
5. **website.** Add a thin page in `apps/website/pages/`; guards are middleware; everything SSR-safe.
6. **Data.** Use the `add-endpoint` skill. Query keys go in `packages/core/src/lib/query-keys.ts` (shared by all apps), endpoints in the app.
7. **Text and test ids.** Use the `add-translation` skill. Add test ids to `packages/core/src/lib/test-ids.ts`.
8. **Imports.** `@/` inside the app, `@workspace/*` for packages, never a relative path across apps.
9. **Tests and checks.** Add specs in the app (apps with a `test:unit` script). Run the `verify` skill, typechecking every app that imports a changed package.
