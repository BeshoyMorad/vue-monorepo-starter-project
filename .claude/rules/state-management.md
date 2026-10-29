---
paths:
  - "apps/*/src/stores/**"
  - "apps/*/src/modules/**/stores/**"
  - "packages/core/src/composables/**"
---

# State management

- **Pinia** holds client, session, and UI state only:
  - Auth in `apps/<app>/src/stores/auth.ts`: access token and the user, persisted with `useLocalStorage` from `@vueuse/core`.
  - Permissions in `apps/<app>/src/stores/permissions.ts`.
  - Module UI state in `apps/<app>/src/modules/<feature>/stores/`.
- **Vue Query** owns all API-backed state: lists, details, mutations, and infinite queries. Caching, refetch, and staleness belong there.
- Do not copy API entity data into Pinia. Read it through a query in a composable.
- Keep storage keys as constants.
- Logout goes through the auth store, which clears the query cache with the app's `queryClient`. Keep that path intact.
- Stores belong to an app. Shared packages must not import an app store. Pass what they need in (the way `createApiClient` takes `getToken`).
- Local component state uses `ref` and `computed`. Share state across components with a store or `provide`/`inject`.
- Known gap: `isAuthenticated` in `auth.ts` is a placeholder (`ref(true)`). Do not rely on it as a real check until it is wired to the token.
