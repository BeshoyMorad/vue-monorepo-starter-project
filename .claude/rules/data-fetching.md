---
paths:
  - "apps/*/src/api/**/*.ts"
  - "apps/*/src/**/services/**/*.ts"
  - "apps/*/src/**/composables/**/*.ts"
  - "apps/*/src/**/*.vue"
  - "packages/core/src/lib/**/*.ts"
  - "apps/*/src/**/*.keys.ts"
---

# Data fetching (TanStack Query)

- All HTTP goes through the app's `api` client from `@/api`. It is created with `createApiClient` from `@workspace/core/lib` (an ofetch client) and gets its token and error handlers from the app. Do not create another client.
- Build URLs only with `apiRoute('name')` from `@/api`. Add new route names to the `routes` object in `apps/<app>/src/api/endpoints.ts` first. No hardcoded `/api/...` strings.
- Services are small `async` functions in `modules/<feature>/services/index.ts` that return typed payloads. `queryFn` and mapping belong in services or composables, not in components.
- Server state uses TanStack Vue Query: `useQuery`, `useMutation`, `useInfiniteQuery`.
- Query keys use `@lukemorales/query-key-factory` and live in each app (not in `@workspace/core`). Each module owns its keys in `apps/<app>/src/modules/<m>/<m>.keys.ts` (`export const usersKeys = createQueryKeys('users', {...})`). `apps/<app>/src/api/query-keys.ts` only merges them with `mergeQueryKeys` into `queryKeys`; register a new module there. In `domain-driven`, domains stay isolated: a domain keeps keys in `domains/<d>/<d>.keys.ts` and uses them directly (`usersKeys.list.queryKey`); only app-wide keys (auth) are merged into `queryKeys`. Never inline arrays like `queryKey: ['users', id]`.
  - Static key: `list: null` -> `queryKeys.users.list.queryKey`.
  - Key with params: `details: (id: string) => [id]` -> `queryKeys.users.details(id).queryKey`. Params go in the array, objects are fine (`list: (filters) => [{ filters }]`).
  - Whole-module scope for invalidation: `queryKeys.users._def`.
  - Keep keys only; `queryFn` stays in services/composables (do not use the factory's `queryFn` option).
- After a mutation, invalidate through `useQueryClient()` using the registry, for example `invalidateQueries({ queryKey: queryKeys.users._def })` (everything in the module) or `queryKeys.users.list.queryKey` (one query and its sub-keys). Do not mirror server data in Pinia.
- The app query client (`apps/<app>/src/lib/query-client.ts`) hashes the active locale into every query. Do not add locale to individual keys. `createBaseQueryClient` in `@workspace/core/lib/query-client` stays i18n-free.
- Lists and tables:
  - `useDataTable` for offset pagination.
  - `useDataInfiniteScroll` for infinite lists.
  - Both come from `@workspace/core/composables`, call `fetchTableData` from `@workspace/core/lib`, and take an `endpoint` and a `queryKey`.
  - Do not write manual pagination or scroll logic.
- Errors are handled by the client's handlers and `@workspace/core/utils/apiError`. Do not add a `try/catch` that toasts manually. Map field errors onto forms with `applyApiErrorToForm` (see the forms rule). Use `@workspace/core/utils/toast` for success messages.
