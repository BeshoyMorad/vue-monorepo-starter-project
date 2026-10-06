# Vue 3 Multi-Tenant Enterprise Monorepo Starter

A production-ready, white-label, multi-tenant monorepo built with **Vue 3**, **Vite**, **TypeScript**, **Turborepo**, and **pnpm workspaces**.

Designed for enterprise teams to rapidly scaffold, build, and deploy multiple branded applications that share core business logic, design tokens, and UI components while maintaining independent tenant theming and deployment lifecycles.

---

## 🏛 Architecture Overview

```text
├── apps/
│   ├── base-template/        # Base reference template for Vite SPA
│   ├── domain-driven/        # Domain-driven modular SPA template
│   ├── website/              # Nuxt 3 SSR website template
│   ├── tenant-a/             # Sample Tenant A (Blue theme, port 3001)
│   └── tenant-b/             # Sample Tenant B (Red theme, port 3002)
│
├── packages/
│   ├── ui/                   # Shared Vue UI component library & Design System
│   │   ├── src/components/   # Form controls, Modals, Buttons, Tables, etc.
│   │   └── src/css/          # Global styles, typography, animations, utilities
│   ├── core/                 # Shared business logic & services
│   │   ├── src/composables/  # Vue composables (auth, table state, media, etc.)
│   │   ├── src/stores/       # Pinia state stores (auth, permissions)
│   │   ├── src/lib/          # API client, TanStack Query client & endpoints
│   │   ├── src/utils/        # Utility helpers, validators & formatters
│   │   └── src/types/        # Shared TypeScript interfaces & types
│   ├── eslint-config/        # Shared ESLint 9/10 flat configuration presets
│   └── tsconfig/             # Shared TypeScript configuration presets
│
├── scripts/
│   ├── add-tenant.js         # Automated tenant scaffolding script
│   └── remove-tenant.js      # Automated tenant removal script
│
├── pnpm-workspace.yaml       # pnpm workspace definition
└── turbo.json                # Turborepo task orchestration & cache pipeline
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: `>= 20.x`
- **pnpm**: `>= 9.x` (Recommended: `pnpm@11.5.0`)

### Installation

```bash
# Install all dependencies across all apps and packages
pnpm install
```

---

## 🛠 Available Scripts

### Development

Run all apps concurrently in watch mode via Turborepo:

```bash
pnpm dev
```

Or run an individual tenant application:

```bash
# Base template (http://localhost:3000)
pnpm dev:base

# Domain-Driven template (http://localhost:3003)
pnpm dev:domain

# Tenant A (http://localhost:3001)
pnpm dev:tenant-a

# Tenant B (http://localhost:3002)
pnpm dev:tenant-b
```

### Building for Production

Build all applications and packages with Turborepo caching:

```bash
pnpm build
```

Or build a specific tenant application:

```bash
pnpm build:base
pnpm build:domain
pnpm build:tenant-a
pnpm build:tenant-b
```

### Code Quality & Validation

```bash
# Lint all workspaces with unified ESLint configuration
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format code across the entire monorepo with Prettier
pnpm format

# Run TypeScript type checking across apps and packages
pnpm type-check
```

---

## 🎨 White-Labeling & Theming System

The design system is centralized inside `@workspace/ui/styles`. Global typography, resets, animations, and token defaults are defined once in `packages/ui/src/css/`.

Each tenant inherits the entire design system and simply overrides brand tokens in its own `src/css/theme.css`:

### 1. Unified CSS Import (`apps/<tenant>/src/css/index.css`)

```css
/* 1. Import unified design system from packages/ui */
@import '@workspace/ui/styles';

/* 2. Apply tenant-specific branding overrides */
@import './theme.css';
```

### 2. Tenant Brand Tokens (`apps/<tenant>/src/css/theme.css`)

```css
:root {
  /* Brand Primary Colors */
  --color-primary: #2563eb;
  --color-primary-rgb: 37, 99, 235;
  --color-primary-foreground: #ffffff;

  /* Focus & Accents */
  --color-ring: #2563eb;
  --color-focus: rgba(37, 99, 235, 0.4);
}
```

---

## 🏢 Multi-Tenant Automation

### Adding a New Tenant

Use the automated CLI script to scaffold a new tenant from `base-template` (Vite SPA), `domain-driven` (Modular DDD SPA), or `website` (Nuxt 3 SSR):

```bash
# General syntax
pnpm tenant:add <tenant-name> [template] [port]
pnpm tenant:add <tenant-name> --template=<base-template|domain-driven|website> [--port=<port>]
```

**Examples:**

```bash
# 1. Scaffold a Vite SPA Dashboard (defaults to base-template)
pnpm tenant:add tenant-c

# 2. Scaffold a Domain-Driven SPA
pnpm tenant:add admin-portal domain-driven 3004
# Or using flags:
pnpm tenant:add admin-portal --template=domain-driven --port=3004

# 3. Scaffold a Nuxt 3 SSR/ISR Website
pnpm tenant:add client-portal website 3005
# Or using flags:
pnpm tenant:add client-portal --template=website --port=3005
```

This automatically:

1. Clones the selected template (`apps/base-template`, `apps/domain-driven`, or `apps/website`) into `apps/<tenant-name>`.
2. Updates `package.json` package name to `@workspace/<tenant-name>`.
3. Configures port in `vite.config.ts` (for Vite / Domain-Driven) or `nuxt.config.ts` (for Nuxt).
4. Registers `dev:<tenant-name>` and `build:<tenant-name>` scripts in root `package.json`.
5. Links workspace dependencies and prepares types via `pnpm install`.

### Removing a Tenant

```bash
pnpm tenant:remove <tenant-name>
```

**Example:**

```bash
pnpm tenant:remove tenant-c
```

_(Note: Protected core directories `base-template` and `website` cannot be removed)._

---

## 📦 Shared Workspace Packages

| Package           | Workspace Specifier        | Purpose                                                                                                            |
| :---------------- | :------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **UI**            | `@workspace/ui`            | Vue 3 UI component library, shadcn-vue base components, icons, and centralized CSS design system.                  |
| **Core**          | `@workspace/core`          | Business logic, Pinia stores, Vue composables, API client, TanStack Query keys, validation schemas, and utilities. |
| **TSConfig**      | `@workspace/tsconfig`      | Shared `tsconfig` presets (`base.json`, `vue.json`, `node.json`).                                                  |
| **ESLint Config** | `@workspace/eslint-config` | Unified ESLint flat config with Vue, TypeScript, and Prettier integration.                                         |

---

## 🚢 CI/CD & Deployment

Each tenant application inside `apps/<tenant>` outputs an optimized static bundle into its local `dist/` directory upon running `pnpm build`. Turborepo enables build caching so only modified tenant applications are rebuilt in CI/CD pipelines.
