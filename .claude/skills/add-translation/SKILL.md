---
name: add-translation
description: Add or change user-facing text in en and ar. Use whenever a component needs a new label, message, placeholder, or error string.
---

# Add translations

Never leave a hard-coded UI string in a template or script.

1. Pick the namespace. Shared words (`common`, `errors`, `nav`, `yup`) live in `packages/locales/src/common/{en,ar}.json`; check there first. App-specific namespaces are the files in `apps/<app>/src/locales/en/` (`apps/domain-driven` has none yet, so use the shared files there).
2. Add the key to **both** `apps/<app>/src/locales/en/<namespace>.json` or `packages/locales/src/common/en.json` and `apps/<app>/src/locales/ar/<namespace>.json` or `packages/locales/src/common/ar.json`. The Arabic value must be real Arabic, not a copy of the English text. Keep the key order identical in both files.
3. JSON files have no wrapper object: `common.json` is `{ "save": "Save" }`. App namespace files have no wrapper; the shared `common/*.json` files keep their wrapper because they hold several namespaces.
4. Use `t('<namespace>.<key>')` in code and `$t(...)` in templates. Interpolate with `{name}` placeholders, not string concatenation. Use plural syntax for counts.
5. If you created a new app namespace file, add it to `MessageSchema` in `apps/<app>/src/locales/messages.ts`. For `apps/website`, run its `pnpm locales:types` so the `en.ts`/`ar.ts` aggregators pick it up.
6. Run `pnpm type-check` (all apps via Turbo) or `pnpm --filter @workspace/<app> type-check`: it regenerates the locale types and fails on a key that does not exist.

The post-edit hook reports key mismatches between `en` and `ar` as soon as one file is saved.
