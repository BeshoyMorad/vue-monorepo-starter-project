---
paths:
  - "apps/**"
  - "packages/**"
---

# Import boundaries

- No relative imports across `apps/*`. Import shared code through `@workspace/core`, `@workspace/ui`, or `@workspace/locales`. Inside an app, use the `@/` alias.
- Packages never import an app: no `@/` alias, no app stores, no app i18n instance. App-level i18n and wiring stay in the app.
- `packages/core` must not import `@workspace/ui`. `core` and `ui` must be SSR-safe: no `window`/`document`/`localStorage` at module scope.
- `packages/core` keeps `"sideEffects": false`. `packages/ui` keeps `"sideEffects": ["**/*.css"]` so global styles survive tree-shaking.
- `apps/domain-driven` follows `app → domains → core → shared` inside its `src/`, and a domain never imports another domain.
- When code is needed by two apps, move the generic part into the right package and update both apps. Do not copy it.
- Known leak: `packages/core/src/composables/useFormMedia.ts` imports `@/types/media`. Do not add similar imports.
