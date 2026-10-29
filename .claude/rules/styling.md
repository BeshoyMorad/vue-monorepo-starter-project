---
paths:
  - "packages/ui/src/css/**"
  - "apps/*/src/css/**"
  - "apps/*/src/**/*.vue"
  - "packages/ui/src/**/*.vue"
---

# Styling & design tokens

- Tailwind CSS v4 (`@tailwindcss/vite`). Prefer utility classes. Avoid `<style>` blocks except for keyframes or truly local exceptions.
- Colors come from tokens in `packages/ui/src/css/token.css` (`@theme`), never raw hex in components. Apps import the shared CSS through `@workspace/ui/styles` and only add app-specific rules in `apps/<app>/src/css/theme.css`. Token families:
  - Semantic: `--color-bg-*`, `--color-text-*`, `--color-border-*`.
  - Palette scales: `--color-primary-*`, `--color-neutral-*`, `--color-success-*`, `--color-danger-*`, `--color-warning-*`, `--color-info-*`.
- Every new semantic token gets both modes with `light-dark()`, referencing palette scales:

  ```css
  --color-bg-custom: light-dark(var(--color-neutral-100), var(--color-neutral-900));
  ```

  Shared primitives must not hardcode light-only colors.
- To remove a token, grep every app and package for its usages first, then delete it from `token.css`.
- Compose classes with `cn()` from `@workspace/core/utils`. Build variants with CVA (`class-variance-authority`), following `packages/ui/src/ui/button`.
- Icons: render them with the `Icon` component from `@workspace/ui` and pass the icon class through its `icon` prop. `iconVariants` controls size and color.
