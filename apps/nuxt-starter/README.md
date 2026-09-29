# Nuxt Starter Project

Nuxt 4 starter with TypeScript, Tailwind CSS v4, shadcn-vue, Pinia, TanStack Query,
VeeValidate + Yup, and `@nuxtjs/i18n` (English and Arabic, with RTL).

The app runs in SPA mode (`ssr: false`) because auth tokens are stored in `localStorage`.
See [docs/NUXT_MIGRATION_REPORT.md](docs/NUXT_MIGRATION_REPORT.md) for how the project was
converted from Vue + Vite and what to change before enabling SSR.

## Setup

```bash
pnpm install          # run from the monorepo root
cp .env.example .env   # then set NUXT_PUBLIC_API_BASE_URL
pnpm dev
```

## Scripts

| Script                        | What it does                                               |
| ----------------------------- | ---------------------------------------------------------- |
| `pnpm dev`                    | Start the dev server on http://localhost:3003              |
| `pnpm build`                  | Production build into `.output/`                           |
| `pnpm start`                  | Run the production build (`node .output/server/index.mjs`) |
| `pnpm generate`               | Static build for plain file hosting                        |
| `pnpm type-check`             | `nuxt typecheck` (vue-tsc over the whole app)              |
| `pnpm test:unit`              | Vitest in the Nuxt test environment                        |
| `pnpm lint` / `pnpm lint:fix` | ESLint                                                     |

## Project structure

```
app/
├── app.vue           Root component: layout + page
├── assets/           Images, icons, and global CSS (assets/css)
├── components/       Shared UI (components/ui = shadcn-vue)
├── composables/      Shared logic in folders: auth, data-table, form, locale, media, network, ui
├── config/env.ts     Validated runtime config (getEnvConfig)
├── constants/        Route names, locales, file-upload constants
├── features/         Feature folders: components, services, schemas, types.ts
├── layouts/          default.vue (app shell) and auth.vue
├── lib/              API client, endpoints, query client and keys
├── middleware/       auth.global (every page), network.global (offline), guest, permission
├── pages/            File-based routes (definePageMeta sets name/layout/middleware)
├── plugins/          api, vue-query, dayjs, error-handler
├── stores/           Pinia stores
├── types/            Shared TypeScript types, one file per domain
└── utils/            Small helpers (not auto-imported)
i18n/
├── locales/          en.ts / ar.ts merge common and feature messages
└── i18n.config.ts    Number and date formats
server/
└── api/examples/     Demo API routes used by the Data Fetching docs page
tests/
├── setup.ts          MSW server and mountWithProviders helper
└── nuxt/             All unit tests, in folders that mirror app/ (tests/nuxt/utils, ...)
```

## Conventions

- **Routes.** Add a file under `app/pages`. Give it a name from `app/constants/route-names.ts`
  in `definePageMeta` and navigate by name. Set `sidebar: true`, `title`, and `order` to show it
  in the sidebar.
- **Types.** Shared types live in `app/types/<domain>.ts` and are imported with `import type`.
  A type used by only one component stays in that component (for example its `Props`).
  Feature types go in `app/features/<feature>/types.ts`. There are no global ambient types.
- **Auth and permissions.** `auth.global.ts` protects every page. Make a page public with
  `definePageMeta({ auth: false })`. To require permissions, add
  `middleware: ['permission']` and `permissions: 'admins.list'` (or a list, with
  `permissionsOperator: 'and'`). Users without them go to the access-denied page.
- **Auto-imports.** Vue and Nuxt APIs, everything re-exported by an
  `app/composables/<folder>/index.ts`, and Pinia stores in `app/stores/` need no import.
  Add a composable to a folder and re-export it from that folder's `index.ts` to make it
  global. Leave a helper out of `index.ts` to keep it private and import it by path (as
  `data-table/useTableState.ts` is). `app/utils/` is left out on purpose, so helpers
  such as the toast `error()` are imported from `@/utils/...`. Feature folders are not scanned
  either: import feature composables and components explicitly.
- **Components.** Components under `app/components/` are auto-imported in templates. Names:
  shadcn primitives in `ui/` keep their names (`<Button>`, `<Tooltip>`); `data-table/` gets a
  `Data` prefix (`<DataTable>`); the custom tooltip is `<AppTooltip>`; form fields get a `Form`
  prefix (`<FormInputText>`) but pages normally use the `Field` namespace, which is a plain
  object and is still imported from `@/components/form`. Components used in script (for
  example in `h()` or `typeof`) are imported from `#components`, Nuxt's module of all
  registered components, by their auto-import name. See the `components` key in
  `nuxt.config.ts`.
- **Tests.** Tests live in `tests/nuxt/`, never in `app/`. Put a test at the path that mirrors
  the file it covers (`app/composables/form/useX.ts` is tested in `tests/nuxt/composables/form/useX.spec.ts`)
  and import the code with `@/`.
- **Data fetching.** Use `useFetch`/`useAsyncData` for read-only content and TanStack Query for
  interactive data. The Documentation > Data Fetching page shows both.
