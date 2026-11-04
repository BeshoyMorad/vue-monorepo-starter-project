---
paths:
  - "**/*.spec.ts"
  - "**/tests/**"
  - "**/vitest.config.ts"
---

# Testing (Vitest)

- Unit tests are Vitest with jsdom and `globals: true`. Name them `*.spec.ts` and put them next to the code under test.
- Each app has its own `tests/setup.ts` (MSW `server`, `findByTestId`, a mount helper). Do not import one app's setup from another.
- Find elements by test id: `findByTestId(wrapper, TEST_IDS.<group>.<key>)` (attribute `data-test-id`). Do not select by class or by translated text.
- Mock HTTP with MSW handlers on the shared `server` (`server.use(http.get(...))`). Handlers reset after each test. Do not stub the API client.
- Mount components with the helper in `tests/setup.ts`; it installs Pinia (`@pinia/testing`) and Vue Query. Give each test a fresh `QueryClient`.
- Run one file: `Run one file with `pnpm --filter @workspace/<app> test:unit --run <file>` (apps `base-template` and `domain-driven`).`. Plain `vitest` starts watch mode, so always pass `--run`.
- Test behavior (inputs, outputs, emits, loading/empty/error states). No whole-component snapshots.
- `packages/*` and `apps/website` have no unit-test script. Do not add one without asking.
