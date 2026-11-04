# Review rules (used by Claude Code Review on PRs)

Only report issues in changed lines. Severity: blocker > major > nit. Skip style nits that lint or Prettier already catch. Stack: Turborepo monorepo (apps + @workspace packages).

## Blockers
- Relative import across `apps/*` (`../../other-app/...`) instead of a `@workspace/*` package
- `packages/core` or `packages/ui` importing an app alias (`@/`), app code, or each other in the wrong direction (`core` → `ui`)
- Browser globals (`window`/`document`/`localStorage`/`navigator`) at module scope in `packages/*` or in `apps/website`
- Cross-domain import inside `apps/domain-driven` (`domains/a` → `domains/b`)
- Auth tokens stored outside the app's `stores/auth.ts` (SPA apps) or `useCookie()` (website)
- `"sideEffects"` changed in `packages/core` (must stay `false`) or `packages/ui` (must keep `**/*.css`)

## Major
- New component/composable/util duplicating an existing primitive (`@workspace/ui`, `@workspace/core`)
- Inline `queryKey` arrays, hardcoded API URLs, manual toasts in `try/catch`, a second HTTP client
- Server data copied into Pinia instead of read through Vue Query
- Manual pagination / scroll logic instead of `useDataTable` / `useDataInfiniteScroll` / `useVirtualScroll`
- Physical Tailwind direction classes (breaks Arabic RTL)
- Hard-coded UI string, or a key added to only one of `en` / `ar`, or an `ar` value left in English
- `any`, `as any`, or `@ts-ignore` without a comment explaining why
- New logic (composable, service, schema, util) with no spec
- Raw `<input>`, `<select>`, custom modal, or table instead of the shared primitives
- Raw hex color or arbitrary color value instead of a design token; new semantic token without `light-dark()`
- Route added without `meta.title`, a lazy import, or a permission/auth guard where the neighbouring routes have one
- Code copied into a second app instead of moved to the right `@workspace/*` package, or a package change that silently alters every app without checking them
- New workspace dependency missing from the package's own `package.json` (relying on hoisting), or a version that differs from the other packages
- `packages/locales` message added to one of `en`/`ar` only; an app namespace that duplicates a shared `common` key

## Nit
- Missing `data-test-id` (value from `TEST_IDS`) on interactive elements; `data-test=` is the wrong attribute
- Inline date/currency/status formatting instead of `formatter.ts` / `formatText.ts` / `formatStatus.ts`
- Parent-relative import (`../x`) instead of the alias
- Component over 300 lines or function over ~50 lines that should be split
- `console.log` left in

## Skip
- Pre-existing problems in lines the PR did not touch.
- Demo and showcase code under `apps/*/src/modules/doc/`, `apps/website/pages/*-example.vue`, and the `demo` locale namespace unless the PR changes how it is meant to be used.
- Generated files (`*.generated.ts`) and lockfiles.
