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
├── composables/      Shared logic (useDataTable, useMultiStepForm, ...)
├── config/env.ts     Validated runtime config (getEnvConfig)
├── constants/        Route names, locales, file-upload constants
├── features/         Feature folders: components, services, schemas, types.ts
├── layouts/          default.vue (app shell) and auth.vue
├── lib/              API client, endpoints, query client and keys
├── middleware/       auth, guest, and the global offline check
├── pages/            File-based routes (definePageMeta sets name/layout/middleware)
├── plugins/          api, vue-query, dayjs, error-handler
├── stores/           Pinia stores
├── types/            Shared TypeScript types, one file per domain
└── utils/            Small helpers
i18n/
├── locales/          en.ts / ar.ts merge common and feature messages
└── i18n.config.ts    Number and date formats
```

## Conventions

- **Routes.** Add a file under `app/pages`. Give it a name from `app/constants/route-names.ts`
  in `definePageMeta` and navigate by name. Set `sidebar: true`, `title`, and `order` to show it
  in the sidebar.
- **Types.** Shared types live in `app/types/<domain>.ts` and are imported with `import type`.
  A type used by only one component stays in that component (for example its `Props`).
  Feature types go in `app/features/<feature>/types.ts`. There are no global ambient types.
- **Imports.** Project code uses explicit imports (`@/...`). Nuxt still auto-imports Vue and
  Nuxt APIs, but `imports.scan` is off so project helpers never become hidden globals.
