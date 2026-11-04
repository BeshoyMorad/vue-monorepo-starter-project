# apps/website (Nuxt 3 SSR)

- Everything must be SSR-safe: no `window`/`document`/`localStorage` at module scope or the root of `<script setup>`. Use `onMounted`, `import.meta.client`, or a `*.client.ts` plugin.
- Routes are file-based (`pages/`). Guards are route middleware in `middleware/`. Auth values use `useCookie`, not `localStorage`.
- Auto-imports are on (`defineStore`, `useCookie`, `navigateTo`, `useI18n`).
- Locales: `locales/{en,ar}/<namespace>.json`, aggregated by `locales/en.ts` and `ar.ts` (run `pnpm locales:types` in this app after adding a namespace).
- Import shared code through `@workspace/*`, never through a relative path into another app.
- This app has no unit-test script. Typecheck with `pnpm --filter @workspace/website type-check`.
