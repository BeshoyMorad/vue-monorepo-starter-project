---
paths:
  - "apps/*/src/**/*.vue"
  - "packages/ui/src/**/*.vue"
---

# Vue components & UI

## SFC shape
- `<script setup lang="ts">` only (no Options API). Block order: `<script>`, `<template>`, then `<style>` only if unavoidable.
- `defineProps<Props>()` and `defineEmits<Emits>()` with typed interfaces. Use `defineModel()` for two-way bindings.
- Use `@formkit/auto-animate` for list transitions where the component already uses it.

## Reuse before you write
- Base primitives live in `packages/ui/src/ui/` (reka-ui based): Accordion, Avatar, Button, Calendar, Card, Combobox, Dialog, DropdownMenu, Popover, Table, Tooltip, and others. Import them from `@workspace/ui`. Do not hand-roll them.
- Form controls (`Field.*`) come from `@workspace/ui`.
- Overlays and feedback: `ConfirmDialog` and `FormDialog` from `@workspace/ui`, and toasts from `@workspace/core/utils/toast`. Do not create new modal wrappers.
- States: `EmptyPlaceholder`, `TableErrorState`, `ExceptionState`, `StatusBadge`.
- A component goes into `packages/ui` only when more than one app uses it, and must be exported from `packages/ui/src/index.ts`. App components stay in `apps/<app>/src/modules/<feature>/components/`.
- Components use **reka-ui and Tailwind**. Do not add PrimeVue.

## Page layout
- Wrap page content in `PageWrapper` from `@workspace/ui`, with `title` and `subtitle` props. Put header buttons in its `actions` slot.

## Tables & lists
- Use `Table` or `InfiniteScrollTable` from `@workspace/ui` with `useDataTable` or `useDataInfiniteScroll` (see the data-fetching rule).
- Columns are `ColumnDef<TRow, unknown>[]` from `@tanstack/vue-table`.

## Styling (RTL-first)
- Logical properties only: `ms-* me-* ps-* pe-* start-* end-* text-start text-end border-s border-e rounded-s rounded-e`.
- Forbidden: `ml- mr- pl- pr- left- right- text-left text-right border-l border-r rounded-l rounded-r`.
- The `check-rtl.sh` hook blocks these after every edit, so fix them before finishing.
- See the styling rule for tokens and `cn()`.

## Test hooks & formatting
- Interactive elements and critical boundaries get `data-test-id`, with the value taken from `TEST_IDS` in `@workspace/core/lib/test-ids`. Add new keys there. Do not use string literals.
- Format dates, currency, and status with `@workspace/core/utils/formatter`, `formatText`, and `formatStatus`. No inline formatting.

## Browser state
- The apps are Vite SPAs. Persist auth values through `useLocalStorage` in the app's `stores/auth.ts`. Do not read `localStorage` directly in components. `packages/ui` and `packages/core` must stay SSR-safe, so keep `window` and `document` out of module scope there.
