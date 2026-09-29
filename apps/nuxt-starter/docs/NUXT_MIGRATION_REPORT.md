# Nuxt Migration Report

Branch: `feat/nuxt-migration` (from `main` at `72a1857`)

This report has two parts. **Part 1** is the plan, written before any code changed.
**Part 2** records what was actually done, what was verified, and what is left.

---

## Part 1 — Plan

### 1. Starting point (measured on `main` before any change)

| Check                    | Result on `main`                                                                                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vite build`             | **Fails** — `modules/assets` imports `ErrorAlert`, which does not exist                                                                                                                                  |
| `vue-tsc` (app tsconfig) | **118 errors** — mostly `modules/assets` and `modules/tokenization`, which import files that are not in this repo (`@/types/network`, `@/modules/vaults/*`, `@/modules/fees/*`, `@/utils/format-status`) |
| `npm run type-check`     | Passes, but only because the root `tsconfig.json` has `"files": []`, so it checks nothing                                                                                                                |
| `vitest run`             | 12 of 17 tests fail — Node 25 ships its own `localStorage` global, which shadows jsdom's                                                                                                                 |
| `eslint .`               | 0 errors, 93 warnings                                                                                                                                                                                    |

The `assets` and `tokenization` modules were copied from another project and never finished here.
The migration moves them but does not rewrite them. They stay excluded from routing until their
missing dependencies exist.

### 2. Target stack

- **Nuxt 4** with the default `app/` source directory.
- **Rendering mode: SPA (`ssr: false`)**. Auth tokens live in `localStorage` (for now) and many composables
  touch `window`/`navigator`. Turning on SSR would change auth to cookies, which is a product
  decision, not a migration step. Code touched during the migration is made SSR-safe where it is
  cheap (guards on `window`, `navigator`, `document`), so enabling SSR later is a smaller step.
- Official Nuxt modules replace hand-written wiring:
  - `@pinia/nuxt` + `pinia-plugin-persistedstate/nuxt` replace `createPinia()` in `main.ts`.
  - `@nuxtjs/i18n` replaces the hand-built `createI18n` instance, lazy loader, and `<html dir/lang>` code.
  - `@nuxt/test-utils` replaces the plain Vitest setup.
- Tailwind v4 stays on `@tailwindcss/vite`, registered through `nuxt.config.ts`.
- TanStack Query, dayjs, and the global error handler move into Nuxt plugins.

### 3. File-by-file mapping

| Vue + Vite (before)                              | Nuxt (after)                                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `index.html` (title, favicon, theme script)      | `nuxt.config.ts` → `app.head`                                                                  |
| `src/main.ts`                                    | `app/plugins/*.ts` (one plugin per concern)                                                    |
| `src/App.vue`                                    | `app/app.vue` (`<NuxtLayout><NuxtPage/></NuxtLayout>`)                                         |
| `src/router/index.ts` route table                | File-based routes in `app/pages/**` with `definePageMeta`                                      |
| `src/router/guards/*.ts`                         | `app/middleware/auth.ts`, `app/middleware/guest.ts`                                            |
| `router.beforeEach` offline check                | `app/middleware/network.global.ts`                                                             |
| `router.afterEach` document title                | `useHead` in `app/app.vue`                                                                     |
| `router.onError` chunk reload                    | Removed — Nuxt reloads on chunk errors by default                                              |
| `src/router/paths.ts`                            | `app/constants/route-names.ts` (same `paths` object, still the single source of route names)   |
| `src/layouts/AppLayout.vue`, `AuthLayout.vue`    | `app/layouts/default.vue`, `app/layouts/auth.vue`                                              |
| `src/modules/**`                                 | `app/features/**` (renamed so it is not confused with Nuxt's own `modules/` directory)         |
| `src/modules/**/pages/*.vue`                     | Moved into `app/pages/**`; each feature keeps its constants, components, and locales           |
| `src/pages/errors/*.vue`                         | `app/pages/access-denied.vue`, `internal-server-error.vue`, `no-internet.vue`, `[...slug].vue` |
| `src/config/env.ts` (`import.meta.env.VITE_*`)   | `runtimeConfig.public` in `nuxt.config.ts`, validated by `app/config/env.ts`                   |
| `src/locales/*`                                  | `i18n/locales/*` (Nuxt i18n layout) + `i18n/i18n.config.ts` for number/date formats            |
| `src/css/*`                                      | `app/assets/css/*`                                                                             |
| `vite.config.ts`, `tsconfig.*.json`, `server.js` | `nuxt.config.ts`, Nuxt-generated tsconfigs, Nitro output (`node .output/server/index.mjs`)     |
| `.env` `VITE_API_BASE_URL`                       | `NUXT_PUBLIC_API_BASE_URL`                                                                     |

Code that imported the router singleton outside components (`lib/api/client.ts`, `stores/auth.ts`,
`composables/useNetwork.ts`, `composables/useAuthRedirect.ts`) switches to `navigateTo()` and
`useRouter()`. The Axios interceptors are installed from a Nuxt plugin so they run inside the Nuxt
app context.

### 4. Type organisation rules

The rule for every type in the codebase:

1. **Shared types go in `app/types/`**, one file per domain. A type counts as shared when more
   than one file uses it, or when it is part of a public contract: API response shapes, composable
   options and return types, util option objects, and props option items that callers build.
2. **A type stays inside a component** only when that component (or its own folder) is the only
   thing that will ever use it. Examples: `Props` and `Emits` interfaces, the editor `ToolbarItem`.
3. **Feature types go in the feature's own `types.ts`.** Types scattered in a feature's schemas,
   constants, utils, and pages are pulled into that one file.
4. **No ambient globals.** `ApiResponse`, `Meta`, `CanPermission`, and similar types are
   currently declared with `declare global`, so they appear everywhere without an import. They
   become normal exports and every user imports them with `import type`. Library augmentation
   (`@tanstack/vue-table` `ColumnMeta`, `vue-i18n` message schema) stays as `declare module`.
5. Duplicated shapes are merged. Examples: `DataTableState` and `InfiniteScrollDataState` are
   identical, and the doc pages redefine the same `User` interface three times.

Planned `app/types/` files:

| File                | Contents                                                                                                                                                                                                                                            | Moved from                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `api.ts`            | `ApiResponse`, `ApiErrorResponse`, `OffsetMeta`, `CursorMeta`, `PaginationMeta`, `OffsetPaginatedResponse`, `CursorPaginatedResponse`                                                                                                               | `types/global.d.ts` (globals)                                                                                     |
| `common.ts`         | `Prettify`                                                                                                                                                                                                                                          | `types/global.d.ts`                                                                                               |
| `table.ts`          | `TableParams`, `TableSort`, `TableStateOptions`, `TableStateReturn`, `UseTableOptions`, `DataTableState`, `UseDataTableReturn`, `UseDataInfiniteScrollOptions`, `UseDataInfiniteScrollReturn`, `PaginationType`, TanStack `ColumnMeta` augmentation | `composables/useTableState.ts`, `useDataTable.ts`, `useDataInfiniteScroll.ts`, `types/global.d.ts`                |
| `media.ts`          | `MediaValue`, `MediaPayload`, `MediaPayloadItem`, `ExtractMediaPayloadOptions`, `StorageServiceType`, `UploadImagePayload`, `UploadImageResponse`, `UrlDetails`                                                                                     | `types/media.ts`, `composables/useFormMedia.ts`, `useUploadImage.ts`, `utils/extractUrlDetails.ts`                |
| `form.ts`           | `StepDefinition`, `MultiStepFormOptions`, `FormPersistenceConfig`, `FormPersistenceOption`, `StorageType`, `UseMultiStepFormReturn`, `RadioGroupOption`, `CheckboxGroupOption`                                                                      | `components/form/multi-step-form/types.ts`, `composables/useMultiStepForm.ts`, `components/form/*-group/index.ts` |
| `locale.ts`         | `LocaleCode`, `LocaleDirection`, `LocaleMeta`                                                                                                                                                                                                       | `locales/config.ts`                                                                                               |
| `permissions.ts`    | `DefaultPermissions`, `AppPermissions`, `PermissionModel`, `CanPermission`                                                                                                                                                                          | `types/permissions.d.ts` (globals)                                                                                |
| `formatter.ts`      | `FormatCurrencyOptions`, `FormatDateMode`, `FormatDateOptions`, `FormatTimeOptions`, `FormatPercentageOptions`, `FormatNumberOptions`, `FormatListOptions`, `FormatSubscriptZerosOptions`                                                           | `utils/formatter.ts`                                                                                              |
| `toast.ts`          | `ToastVariant`, `ToastOptions`                                                                                                                                                                                                                      | `utils/toast.ts`                                                                                                  |
| `country.ts`        | `CountryOption`                                                                                                                                                                                                                                     | `utils/countries.ts`                                                                                              |
| `virtual-scroll.ts` | `UseVirtualScrollOptions`, `UseVirtualScrollReturn`                                                                                                                                                                                                 | `composables/useVirtualScroll.ts`                                                                                 |
| `auth.ts`           | `AuthSession` (the payload `login()` stores)                                                                                                                                                                                                        | inline type in `stores/auth.ts`                                                                                   |

Types that stay where they are, because only their own component uses them:

- Every `Props`, `Emits`, and `*Props` interface inside a `.vue` file.
- `ToolbarItem` moves from `toolbar-items.ts` into `components/form/editor/types.ts`, inside the
  editor folder, because only the editor uses it.
- `IconVariants`, `ButtonVariants`, `InputVariants`, `CheckboxGroupVariants`, `RadioGroupVariants`,
  and `LayoutTypes` stay next to the `cva()` or calendar code they are derived from.
- `ExtendedAxiosRequestConfig` stays private to `lib/api/client.ts`.

### 5. Verification plan

After the migration, the branch must:

1. Build with `nuxt build`.
2. Pass `nuxt typecheck` with no errors outside the two unfinished modules, and no more errors
   there than on `main`.
3. Run the Vitest suite through `@nuxt/test-utils`.
4. Pass `eslint .` with 0 errors.
5. Start with `nuxt dev` and serve the main routes.

---

## Part 2 — What was done

### 1. Results

| Check                                  | `main`                                  | This branch                                                                          |
| -------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------ |
| Production build                       | Fails (missing `ErrorAlert`)            | **Passes** (`nuxt build`)                                                            |
| Type-check, whole app                  | Not run (root tsconfig checked nothing) | `nuxt typecheck`: **0 errors** outside `features/assets` and `features/tokenization` |
| Type-check, the two unfinished modules | 103 errors                              | 102 errors (unchanged cause: files missing from the repo)                            |
| Unit tests                             | 5 of 17 pass                            | **32 of 32 pass** (15 new route and sidebar tests)                                   |
| ESLint                                 | 0 errors, 93 warnings                   | 0 errors, 7 warnings (all existed on `main`)                                         |

The built app was also checked in headless Chrome on the production server and on `nuxt dev`.
Each route rendered with the right `<title>` and no console errors. These routes were checked:
`/`, `/documentation`, `/components`, `/components/button`, `/components/table`, `/forms`,
`/forms/otp-input`, `/forms/phone-input`, `/forms/multi-step-form`,
`/composables/use-data-table`, `/composables/use-infinite-scroll`, `/auth/login`, and an unknown
URL. With an Arabic browser language the page switched to `lang="ar" dir="rtl"` and the Arabic
messages loaded lazily.

### 2. Differences from the plan

- **Route names.** `app/constants/route-names.ts` keeps the same `paths` object. Pages pass
  those constants to `definePageMeta({ name })`, and a test resolves each name to its URL.
- **Sidebar order.** Nuxt sorts file routes alphabetically, so each page now sets `order` in
  its meta. `app/utils/navigation.ts` sorts by it for both the sidebar and the overview cards.
  Route meta (`title`, `sidebar`, `icon`, `order`) is typed in `app/types/router.d.ts`, which
  removed the `as string` cast in the sidebar.
- **`<html lang/dir>`** comes from the app's own locale metadata in `app.vue`.
  `useLocaleHead` was dropped because it needs an SEO `baseUrl` this SPA does not have.
- **Auto-imports.** Vue, Nuxt, and module APIs are still auto-imported. Scanning of project
  folders is off (`imports.scan: false`) so helpers like the toast `error()` never become
  hidden globals. Project code keeps explicit `@/` imports.
- **Components.** Auto-registration only scans `.vue` files. The shadcn `index.ts` barrels
  otherwise registered duplicate component names.
- **Dependencies.** Vue went to 3.5.43 and Pinia to 4. Without the Vue bump pnpm installed two
  Vue copies and two vue-router copies, which broke `Ref` and route types. Removed: `vite`,
  `@vitejs/plugin-vue`, `@vue/tsconfig`, `rollup-plugin-visualizer`, `server.js`.
  The Vite `manualChunks` config was dropped. Nuxt manages chunking, and
  `app.buildAssetsDir: '/project_assets/'` keeps the old asset path.

### 3. Type changes, as built

The `app/types/` files match the table in Part 1, plus these:

- `env.ts` holds `AppEnvConfig`, the typed result of `getEnvConfig()`.
- `router.d.ts` holds the typed route meta.
- `i18n.d.ts` holds the typed message keys, moved from `locales/schema.d.ts`.
- `media.ts` also keeps the unused global `Image` shape, renamed `ApiImage` because the old
  name shadowed the DOM `Image` constructor.

These other type changes landed:

- `Meta` was renamed `OffsetMeta`. `DataTableState` replaces the duplicate
  `InfiniteScrollDataState`. `CanPermission` no longer repeats the same union twice.
- The composables barrel no longer re-exports types. Types are imported from `@/types/*` only.
- Feature types were consolidated:
  - `features/doc/types.ts` replaces three inline `User` interfaces and two `MockUser` or
    `UserFilters` pairs.
  - `features/auth/types.ts` now holds `LoginForm`, which was in the schema file.
  - `features/assets/types.ts` and `features/tokenization/types.ts` now hold their form value
    types and `TokenStatusProperty`.
- Private helper types stay in their own file: component `Props`/`Emits`,
  `ExtendedAxiosRequestConfig`, `UseCustomTokenFormOptions`, and similar.

### 4. Bugs found and fixed along the way

- **Button variants.** Fifteen type errors on `main` came from the last commit's Button change.
  `variant="outline"` and `"secondary"` no longer exist, and some buttons lacked the required
  `test-id`. The fix uses the `outline` flag and adds test IDs.
- **`v-auto-animate`.** `FormDialog` and `MultiStepForm` used this directive, but it was never
  registered. It is now registered in `plugins/auto-animate.ts`.
- **Unchecked indexes.** Nuxt's strict `noUncheckedIndexedAccess` flagged array reads that could
  be `undefined`. They were in `formatter.ts`, `useMultiStepForm.ts`, `useUploadImage.ts`,
  `file-upload.ts`, `permissions.ts`, and `BasePhoneInput.vue`, and each now handles the missing case.
- **DOM element refs.** These now use `shallowRef`, so their element type is kept.
- **First-load aborts.** On a first page load, Nuxt shows a 404 when middleware aborts.
  The guest and offline middleware now redirect instead of aborting.
- **Node 25 tests.** Tests run with `--no-experimental-webstorage`, so Node's built-in
  `localStorage` no longer shadows jsdom's.

### 5. Still open

1. **`features/assets` and `features/tokenization` are unfinished.** They import modules that
   are not in this repo. `/assets` is no longer routed, because on `main` it broke the whole
   build. `pnpm type-check` exits non-zero until these modules are finished or deleted.
2. **`authStore.isAuthenticated` is hard-coded to `true`.** This is the same as on `main`,
   so `/auth/login` always redirects to the dashboard.
3. **`features/dashboard` and `features/starter` pages are not routed.** This is the same as on
   `main`. They are kept as examples.
4. **Enabling SSR** needs cookie-based tokens (`useCookie`) instead of `localStorage`. After
   that, set `ssr: true`. Code touched here already guards `window` and `navigator`.
5. **Environment variable rename.** Local `.env` files need `NUXT_PUBLIC_API_BASE_URL` in place
   of `VITE_API_BASE_URL`. See `.env.example`.
6. **pnpm version.** The lockfile was regenerated with pnpm 10. `pnpm-workspace.yaml` still uses
   `allowBuilds`, which pnpm 10 ignores. It skipped the `esbuild` postinstall with no effect on
   the build.

---

## Part 3 — Follow-up: middleware, auto-imports, data fetching

This part finishes the three steps that were only partly done.

### 1. Middleware

- `middleware/auth.global.ts` replaces the named `auth` middleware. It runs on every route.
  Pages opt out with `definePageMeta({ auth: false })`: the login page and the four error pages.
  The set of protected pages is the same as before, and new pages are protected by default.
- `middleware/permission.ts` is new. The Vue app had no permission guard. It reads
  `meta.permissions` and `meta.permissionsOperator` and checks them with the permissions store.
  Denied users are redirected to the access-denied page. The Data Fetching docs page uses it as
  the example.
- The mock permission store granted `admin.list`, but the permission types only define
  `admins`, so no typed check could pass. It now grants `admins.list`.
- `tests/nuxt/middleware.spec.ts` covers both middleware files.

### 2. Auto-imports

- `imports.scan` is on. An `imports:dirs` hook removes `app/utils/`, so the toast helpers are
  still not globals. Composables in `app/composables/*.ts` and stores (through `@pinia/nuxt`)
  are auto-imported. The composables barrel `app/composables/index.ts` was deleted because it
  duplicated every name.
- Component folders are registered so every name is unique. See the `components` key in
  `nuxt.config.ts` and the README. Tags that changed: data-table components get a `Data`
  prefix, the custom tooltip is `AppTooltip`, form internals get a `Form` prefix, `Toaster` is
  `Sonner`, and the example card is `ExampleCard`.
- A script removed manual imports of Vue APIs, `#imports`, composables, stores and shared
  components across the app. Imports stay where they are still needed:
  - type-only imports;
  - the `Field` namespace (a plain object, not a component);
  - components used in script code (`h()`, `typeof`);
  - five files that wrap a shadcn component with the same file name, such as
    `tooltip/Tooltip.vue`, where Vue would read the tag as a self-reference;
  - components inside `app/features/`, which are not scanned.
- Code samples on the docs pages were updated to match.

### 3. Data fetching

- `pages/documentation/data-fetching.vue` shows `useFetch` with a reactive query next to a
  TanStack Query composable that polls every 5 seconds.
- Both call demo Nitro routes in `server/api/examples/`, so the page works without a backend.
- `useFetch` runs in the browser while `ssr: false` is set. The same code server-renders once
  SSR is enabled.

### 4. Verification

| Check           | Result                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| Type-check      | 0 errors (app and server tsconfigs)                                                                                 |
| Unit tests      | 39 of 39 pass (7 new)                                                                                               |
| ESLint          | 0 errors, 7 warnings (same as before)                                                                               |
| `nuxt build`    | Passes                                                                                                              |
| Headless Chrome | Every docs, component, form, composable and error route renders with no console errors and no unresolved components |

### 5. TanStack Query SSR hydration (step 6)

- `app/lib/query-client.ts` now exports `createQueryClient()` instead of a shared instance.
  `plugins/vue-query.ts` creates one client per app instance, so on the server each request
  gets its own cache. App code already used `useQueryClient()`, so nothing else changed.
- On the server the plugin dehydrates the cache into `useState('vue-query')` on
  `app:rendered`. In the browser it hydrates that state before components mount.
- A query runs during server rendering only if its component waits for it with
  `onServerPrefetch(suspense)`. The Data Fetching page does this, and its query's `staleTime`
  equals its polling interval so hydrated data is not refetched on mount.
- `useDarkTheme` now touches `document` only in the browser. It was the first crash when the
  app was rendered on the server.

Checked with a temporary `ssr: true` build that was not kept. The Data Fetching page rendered
its stats and articles on the server, and the payload contained the dehydrated query. In the
browser the page made no stats request until the first 5-second poll, with no console errors.
Other pages were not checked under SSR.

### 6. Still open

- **Enabling SSR** still needs auth tokens in cookies (`useCookie`) instead of `localStorage`,
  and a pass over other browser-only code. The hydration plugin is ready for it.
