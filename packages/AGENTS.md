# Shared packages (`@workspace/*`)

- Everything here is consumed by several apps. Check every consumer before changing an exported API (grep `@workspace/<package>` in `apps/`).
- Never import an app: no `@/` alias, no app stores, no app i18n instance. `packages/core` must not import `@workspace/ui`.
- No browser globals (`window`, `document`, `localStorage`, `navigator`) at module scope. Code here runs in the Nuxt `website` on the server too.
- `packages/core` keeps `"sideEffects": false`. `packages/ui` keeps `"sideEffects": ["**/*.css"]`.
- Locale text shared by apps goes in `packages/locales/src/common/{en,ar}.json` (both languages, same keys).
- Full rules: `.claude/rules/boundaries.md`.
