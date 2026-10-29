---
paths:
  - "apps/*/src/modules/**"
  - "apps/*/src/lib/**"
  - "packages/**"
---

# Module structure

- Feature code lives in `apps/<app>/src/modules/<feature>/`. Keep feature-only code there.
- Code that several apps use lives in a package: `packages/core` (composables, utils, API and router factories, types), `packages/ui` (components, form fields, design tokens), and `packages/locales` (shared messages, locale config and formats). Move code into a package only when a second app needs it.
- Match the layout of the module you are editing. Not every folder is required:

```text
apps/<app>/src/modules/<feature>/
  <feature>.routes.ts      # RouteRecordRaw[] (see routing rule)
  <feature>.paths.ts       # route name constants
  pages/                   # page components (or top-level Login.vue, Index.vue)
  components/              # feature-only UI
  composables/             # feature hooks wrapping useQuery / useMutation
  services/index.ts        # API calls: the app's `api` + `apiRoute()`, typed returns
  schemas/<name>.schema.ts # yup schemas
  stores/                  # Pinia stores for client state only
  types.ts                 # request / response types
```

- Services are an object of `async` functions, for example `authServices.login`. Keep transforms in services or composables, not in components.
- App-wide wiring (`api/`, `router/`, `stores/`, `lib/`, `locales/`, `config/`) lives next to `modules/` in each app.
- `modules/doc/` is the component and composable showcase. Do not add product features there.
- Packages must not import from apps. `packages/core` and `packages/ui` stay SSR-safe, and `packages/core` never imports an app's i18n instance, so app-level i18n code lives in the app.
