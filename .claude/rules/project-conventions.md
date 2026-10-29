# Project conventions

- TypeScript everywhere. Vue SFCs use `<script setup lang="ts">` only (no Options API).
- Inside an app, import with the `@/` alias (`@/*` → that app's `src/*`). Share code across apps only through `@workspace/core`, `@workspace/ui`, and `@workspace/locales`. Never use relative imports across `apps/*` or `packages/*`.
- Prefer named exports. Use `index.ts` barrels for a folder's public API (`@workspace/ui`, `@workspace/core/composables`, `@/lib/yup`).
- Merge classes with `cn()` from `@workspace/core/utils`.
- Formatting follows `.prettierrc`: single quotes, semicolons, 2-space indent, `printWidth` 100, `trailingComma: es5`. Tailwind class order is handled by `prettier-plugin-tailwindcss`.
- Tests are Vitest, with `*.spec.ts` next to the code under test. Run one file with `pnpm --filter @workspace/base-template test:unit --run <file>`.
- Lint with `pnpm lint` (Turborepo), typecheck one app with `pnpm --filter @workspace/base-template type-check`.
