# Project instructions

<!-- Shared by Codex, Gemini CLI, Cursor, and Claude Code (CLAUDE.md imports this file). Keep it tool-neutral and under 200 lines. -->

## Stack

pnpm workspace + Turborepo. Apps: `base-template` (Vue 3 SPA, `src/modules/`), `domain-driven` (Vue 3 SPA, `src/domains/`), `website` (Nuxt 3 SSR, `@nuxtjs/i18n`). Packages: `@workspace/core` (SSR-safe logic: API client, query keys, composables, utils, yup, router factory), `@workspace/ui` (components), `@workspace/locales` (shared messages and i18n helpers), `@workspace/eslint-config`, `@workspace/tsconfig`. Tailwind v4 + reka-ui, Pinia, TanStack Vue Query/Table, vee-validate + Yup, vue-i18n, Vitest + MSW.

## Commands

- Dev: `pnpm dev:base` · `pnpm dev:domain` · `pnpm dev:website` (build: `pnpm build:base|domain|website`)
- Typecheck all: `pnpm type-check` (Turbo) · Lint all: `pnpm lint` · Format: `pnpm format`
- Unit (one app, one file): `pnpm --filter @workspace/base-template test:unit --run <file>` (or `@workspace/domain-driven`). `website` and the packages have no unit-test script.
- Typecheck one app: `pnpm --filter @workspace/<app> type-check` · New domain: `pnpm --filter @workspace/domain-driven create:domain <name>`
- Tenants: `pnpm tenant:add` / `pnpm tenant:remove`. Everything at once: `pnpm verify` (only when asked).
- Verify a change with lint on the changed files, typecheck, and the relevant spec only. Never run the full suite unless asked. `pnpm test:unit` alone starts watch mode and hangs, so always pass `--run`.

## Architecture

- **Know which app you are in.** `base-template` and `domain-driven` are Vite SPAs (persist with `useLocalStorage`); `website` is Nuxt SSR (cookies, no browser globals at module scope).
- **No relative imports across `apps/*`.** Shared code goes through `@workspace/*` (`core`, `ui`, `locales`). App-only code stays in the app.
- **Packages stay SSR-safe and app-agnostic.** `packages/core` must not import `@workspace/ui`, an app alias (`@/`), or an app's i18n instance; `packages/ui` and `packages/core` touch no browser globals at module scope. `packages/core` is `"sideEffects": false`; `packages/ui` declares `["**/*.css"]` so its styles survive tree-shaking.
- `apps/domain-driven` follows the domain layering: `app → domains → core → shared`; a domain never imports another domain.
- Move code into a package only when a second app needs it. When it moves, update every app that had a copy.
- Known leak (do not copy): `packages/core/src/composables/useFormMedia.ts` imports `@/types/media`, an app alias.

## Golden rule: reuse before you write

Before creating any component, composable, or util, search for an existing one (`@workspace/ui` (`ui`, `form`, `data-table`), `@workspace/core` (`composables`, `utils`, `lib`)). If one exists, use it. If you believe a new primitive is truly needed, say so and ask first.

## Where things live (don't search for these, use them)

- Shared logic (`packages/core/src/`): `lib/api/` (`createApiClient`, endpoints helpers, table), `lib/query-keys.ts` (`QUERY_KEYS`), `lib/test-ids.ts` (`TEST_IDS`), `lib/yup/`, `lib/query-client.ts`, `composables/`, `utils/` (`apiError`, `toast`, `formatter`, `formatText`, `formatStatus`), `router/` (`createAppRouter`, `basePaths`), `env/`
- Shared UI: `packages/ui/src/` (`ui`, `form`, `data-table`, `form-dialog`, `confirm-dialog`, `placeholders`, `pages`), tokens in `packages/ui/src/css/` · Alias `@workspace/ui/styles`
- Per-app endpoints and API client: `apps/<app>/src/api/endpoints.ts` + `index.ts` (website: `apps/website/api/endpoints.ts`, `composables/useApi.ts`)
- Per-app stores: `apps/<app>/src/stores/{auth,permissions}.ts` · router: `apps/<app>/src/router/` · env: `packages/core/src/env/`
- Translations: shared `common`/`errors`/`nav`/`yup` in `packages/locales/src/common/{en,ar}.json`; app namespaces in `apps/<app>/src/locales/{en,ar}/<namespace>.json` (website: `apps/website/locales/`)
- Test IDs and `cn()`: from `@workspace/core`. Run an app-scoped command with `pnpm --filter @workspace/<app> ...`

## Non-negotiables (details in `.claude/rules/`)

- **RTL-first.** Logical Tailwind classes only (`ms-* me-* ps-* pe-* start-* end-* text-start text-end`). Never `ml- mr- pl- pr- left- right- text-left text-right`.
- **No hard-coded UI strings.** Every label goes in `en` and `ar` JSON, used through `t()`.
- **Registries, not literals.** Query keys from `QUERY_KEYS`, URLs from `apiRoute()`, test ids from `TEST_IDS` (`data-test-id`), colors from the token file, route names from `paths`.
- **Server state in Vue Query, client state in Pinia.** Never copy API data into a store. No manual `try/catch` toasts.
- **Strict TypeScript.** No `any`, `interface` over `type`, `import type`, `@/` alias instead of `../`. Files under 300 lines.

## Path-scoped rules

Detailed rules live in `.claude/rules/`. Claude Code and Cursor (through the stubs in `.cursor/rules/`) load them by path automatically. Every other tool: before you edit files matching a glob below, read that rule file.

- `.claude/rules/boundaries.md`: `apps/**`, `packages/**`
- `.claude/rules/data-fetching.md`: `apps/*/src/api/**/*.ts`, `apps/*/src/**/services/**/*.ts`, `apps/*/src/**/composables/**/*.ts`, `apps/*/src/**/*.vue`, `packages/core/src/lib/**/*.ts`
- `.claude/rules/forms-and-validation.md`: `apps/*/src/**/schemas/**/*.ts`, `apps/*/src/**/*.vue`, `packages/ui/src/form/**`
- `.claude/rules/graphify.md`: always relevant
- `.claude/rules/i18n.md`: `apps/*/src/locales/**`, `packages/locales/**`, `apps/*/src/**/*.vue`
- `.claude/rules/module-structure.md`: `apps/*/src/modules/**`, `apps/*/src/lib/**`, `packages/**`
- `.claude/rules/permissions.md`: `apps/*/src/stores/permissions.ts`, `apps/*/src/router/guards/**`, `packages/core/src/router/guards/**`, `apps/*/src/**/*.vue`
- `.claude/rules/project-conventions.md`: always relevant
- `.claude/rules/routing.md`: `apps/*/src/router/**`, `apps/*/src/modules/**/*.routes.ts`, `apps/*/src/modules/**/*.paths.ts`, `packages/core/src/router/**`
- `.claude/rules/state-management.md`: `apps/*/src/stores/**`, `apps/*/src/modules/**/stores/**`, `packages/core/src/composables/**`
- `.claude/rules/styling.md`: `packages/ui/src/css/**`, `apps/*/src/css/**`, `apps/*/src/**/*.vue`, `packages/ui/src/**/*.vue`
- `.claude/rules/testing.md`: `**/*.spec.ts`, `**/tests/**`, `**/vitest.config.ts`
- `.claude/rules/typescript.md`: `**/*.ts`, `**/*.vue`
- `.claude/rules/vue-ui.md`: `apps/*/src/**/*.vue`, `packages/ui/src/**/*.vue`

## Automated checks

- Hooks in `.claude/hooks/` (wired for Claude Code in `.claude/settings.json`, Gemini CLI in `.gemini/settings.json`, Codex in `.codex/hooks.json`, Cursor in `.cursor/hooks.json`): after each edit they run Prettier, RTL / convention / en-ar locale-parity checks, and ESLint on the file. Before edits they block lockfiles, `.env`, `*.generated.ts`, and build output. Before shell commands they block `vitest` without `--run`, force push, `--no-verify`, and `git reset --hard`. Fix what they report before moving on.
- No hooks in your tool? After editing, run `.claude/hooks/post-edit.sh <file>...` yourself and fix what it prints.

## Skills and subagents

- Skills (`fe-review`, `verify`, `add-endpoint`, `add-translation`, `new-feature`) are in `.claude/skills/`. Cursor reads that folder directly; Gemini CLI and Codex read it through the `.agents/skills` symlink. Their `SKILL.md` files are plain instructions: read and follow them if your tool does not load skills.
- Reviewer and test-writer subagent definitions: `.claude/agents/` (Claude Code), `.gemini/agents/` (Gemini CLI). Cursor reads `.claude/agents/` (its read-only `fe-reviewer` override is in `.cursor/agents/`). Without subagents, apply the checklist in `.claude/agents/fe-reviewer.md` yourself.

## Working style

- For anything touching more than 3 files, propose a plan first and wait for approval.
- Be concise. Show diffs, not whole files. Don't re-explain code I can read.
- Don't add dependencies, edit `package.json` scripts, or change `packageManager`/`engines` without asking.
- Never commit, push, or discard changes unless asked.
- For architecture or "where does X live" questions, if `graphify-out/GRAPH_REPORT.md` exists, read it before grepping the codebase.
