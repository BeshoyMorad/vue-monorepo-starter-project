---
paths:
  - "apps/*/src/api/**/*.ts"
  - "apps/*/src/**/services/**/*.ts"
  - "apps/*/src/**/composables/**/*.ts"
  - "apps/*/src/**/*.vue"
  - "packages/core/src/lib/**/*.ts"
---

# Data fetching (TanStack Query)

- All HTTP goes through the app's `api` client from `@/api`. It is created with `createApiClient` from `@workspace/core/lib` (an ofetch client) and gets its token and error handlers from the app. Do not create another client.
- Build URLs only with `apiRoute('name')` from `@/api`. Add new route names to the `routes` object in `apps/<app>/src/api/endpoints.ts` first. No hardcoded `/api/...` strings.
- Services are small `async` functions in `modules/<feature>/services/index.ts` that return typed payloads. `queryFn` and mapping belong in services or composables, not in components.
- Server state uses TanStack Vue Query: `useQuery`, `useMutation`, `useInfiniteQuery`.
- Query keys come from the `QUERY_KEYS` registry in `@workspace/core/lib/query-keys`, for example `QUERY_KEYS.starter.profile()`. Add new keys there before using them. Never inline arrays like `queryKey: ['users', id]`.
- After a mutation, invalidate through `useQueryClient()` using the registry, for example `invalidateQueries({ queryKey: QUERY_KEYS.users.all() })`. Do not mirror server data in Pinia.
- The app query client (`apps/<app>/src/lib/query-client.ts`) hashes the active locale into every query. Do not add locale to individual keys. `createBaseQueryClient` in `@workspace/core/lib/query-client` stays i18n-free.
- Lists and tables:
  - `useDataTable` for offset pagination.
  - `useDataInfiniteScroll` for infinite lists.
  - Both come from `@workspace/core/composables`, call `fetchTableData` from `@workspace/core/lib`, and take an `endpoint` and a `queryKey`.
  - Do not write manual pagination or scroll logic.
- Errors are handled by the client's handlers and `@workspace/core/utils/apiError`. Do not add a `try/catch` that toasts manually. Map field errors onto forms with `applyApiErrorToForm` (see the forms rule). Use `@workspace/core/utils/toast` for success messages.
