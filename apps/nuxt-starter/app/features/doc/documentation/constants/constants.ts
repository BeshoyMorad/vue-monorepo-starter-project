export const ARCHITECTURE_DOM = {
  title: 'Base Project Architecture',
  description:
    'A complete Nuxt base project that provides a consistent structure and architecture for building scalable application features.',

  introduction: {
    title: 'What is this project?',
    description:
      'This project provides a reusable foundation for Nuxt applications. It includes shared components, composables, forms, services, queries, mutations, schemas, and common project conventions so new features can follow the same architecture.',
  },

  structure: {
    title: 'Project Structure',
    description:
      'The project separates shared functionality from feature-specific code. Routes are files in app/pages, shared functionality lives in the other app folders, and each feature keeps its own components, logic, and API-related code together in app/features.',
  },
  featureStructure: {
    title: 'Feature Structure',
    description:
      'Feature-specific code is grouped together inside its feature folder. Route pages live in app/pages and import from the feature. This keeps each feature easier to understand, maintain, and extend.',
  },

  featureArchitecture: {
    title: 'Feature Architecture',
    description:
      'Each feature follows a layered structure. Pages and components use composables for reusable logic, while queries and mutations communicate with services that use the shared API client.',
  },

  newFeature: {
    title: 'Adding a New Feature',
    description:
      'When creating a new feature, follow the existing feature structure and reuse shared functionality whenever possible.',
  },

  principles: {
    title: 'Architecture Principles',
    description:
      'These principles keep the project consistent, maintainable, and easier to extend as new features are added.',
  },
} as const;

export const ARCHITECTURE_STRUCTURE_CODE = `📁 app/
├── 📁 assets/
│   └── 📁 css/
├── 📁 components/
├── 📁 composables/
├── 📁 config/
├── 📁 constants/
├── 📁 features/
│   ├── 📁 auth/
│   ├── 📁 doc/
│   └── 📁 ...
├── 📁 layouts/
├── 📁 lib/
├── 📁 middleware/
├── 📁 pages/
├── 📁 plugins/
├── 📁 stores/
├── 📁 types/
├── 📁 utils/
└── 📄 app.vue
📁 i18n/
├── 📁 locales/
└── 📄 i18n.config.ts
📄 nuxt.config.ts`;

export const ARCHITECTURE_FEATURE_CODE = `📁 features/
└── 📁 users/
    ├── 📁 columns/
    ├── 📁 components/
    ├── 📁 composables/
    ├── 📁 constants/
    ├── 📁 locales/
    ├── 📁 mutations/
    ├── 📁 schemas/
    ├── 📁 services/
    └── 📄 types.ts
📁 pages/
└── 📁 users/
    ├── 📄 index.vue
    └── 📄 [id].vue`;

export const ARCHITECTURE_STRUCTURE_ITEMS = [
  {
    name: 'assets/',
    description: 'Images, icons, and global CSS (assets/css) processed by the build.',
  },
  {
    name: 'components/',
    description: 'Reusable application-level UI components.',
  },
  {
    name: 'composables/',
    description: 'Reusable application logic and stateful behavior.',
  },
  {
    name: 'config/',
    description: 'Validated runtime configuration read from nuxt.config.ts runtimeConfig.',
  },
  {
    name: 'constants/',
    description: 'Application-wide static values, including route names and locale metadata.',
  },
  {
    name: 'features/',
    description:
      'Feature folders containing feature-specific components, logic, locales, and API operations.',
  },
  {
    name: 'layouts/',
    description: 'Nuxt layouts. default.vue wraps signed-in pages and auth.vue wraps login pages.',
  },
  {
    name: 'lib/',
    description: 'Shared library configurations and third-party integrations.',
  },
  {
    name: 'middleware/',
    description: 'Route middleware such as the auth, guest, and offline checks.',
  },
  {
    name: 'pages/',
    description:
      'File-based routes. Each page sets its route name, layout, middleware, and sidebar meta with definePageMeta.',
  },
  {
    name: 'plugins/',
    description:
      'Nuxt plugins that run at startup: API client, TanStack Query, dayjs, and error handling.',
  },
  {
    name: 'stores/',
    description: 'Global application state managed with Pinia.',
  },
  {
    name: 'types/',
    description:
      'Shared TypeScript types, one file per domain. A type used by only one component stays in that component.',
  },
  {
    name: 'utils/',
    description: 'Small reusable utility functions used across the application.',
  },
  {
    name: 'app.vue',
    description: 'Root component that renders the active layout and page.',
  },
  {
    name: 'i18n/',
    description: 'Translation files and number/date formats loaded by @nuxtjs/i18n.',
  },
  {
    name: 'nuxt.config.ts',
    description: 'Framework configuration: modules, runtime config, head tags, and i18n.',
  },
] as const;

export const ARCHITECTURE_FEATURE_ITEMS = [
  {
    name: 'components/',
    description: 'UI components used only by the feature.',
  },
  {
    name: 'composables/',
    description: 'Reusable logic and state specific to the feature.',
  },
  {
    name: 'constants/',
    description: 'Static values and configuration specific to the feature.',
  },
  {
    name: 'mutations/',
    description: 'Write operations that change backend data.',
  },
  {
    name: 'locales/',
    description: 'Feature translations merged into i18n/locales.',
  },
  {
    name: 'schemas/',
    description: 'Validation schemas used by feature forms.',
  },
  {
    name: 'services/',
    description: 'API methods used by the feature.',
  },
  {
    name: 'types.ts',
    description: 'TypeScript types shared across the feature.',
  },
  {
    name: 'pages/users/',
    description: 'Route files for the feature, placed in app/pages.',
  },
] as const;

export const ARCHITECTURE_QUERY_FLOW_ITEMS = [
  {
    title: 'Page / Component',
    description: 'Requests or displays feature data.',
  },
  {
    title: 'Composable',
    description: 'Connects the UI with the query logic.',
  },
  {
    title: 'Query',
    description: 'Manages server-state fetching and caching.',
  },
  {
    title: 'Service',
    description: 'Defines the API request for the feature.',
  },
  {
    title: 'API Client',
    description: 'Sends the HTTP request with shared configuration.',
  },
  {
    title: 'Backend',
    description: 'Processes the request and returns the response.',
  },
] as const;

export const ARCHITECTURE_MUTATION_FLOW_ITEMS = [
  {
    title: 'Page / Component',
    description: 'Triggers an action such as create, update, or delete.',
  },
  {
    title: 'Composable',
    description: 'Exposes the mutation behavior to the UI.',
  },
  {
    title: 'Mutation',
    description: 'Manages the server-state write operation.',
  },
  {
    title: 'Service',
    description: 'Defines the API request for the operation.',
  },
  {
    title: 'API Client',
    description: 'Sends the HTTP request with shared configuration.',
  },
  {
    title: 'Backend',
    description: 'Processes the operation and updates the data.',
  },
] as const;
export const ARCHITECTURE_FLOWS = [
  {
    key: 'query',
    title: 'Query Flow',
    description: 'Used for reading and fetching server data.',
    items: ARCHITECTURE_QUERY_FLOW_ITEMS,
  },
  {
    key: 'mutation',
    title: 'Mutation Flow',
    description: 'Used for operations that change server data.',
    items: ARCHITECTURE_MUTATION_FLOW_ITEMS,
  },
] as const;
export const ARCHITECTURE_QUERY_FLOW_CODE = `Page / Component
       ↓
   Composable
       ↓
      Query
       ↓
    Service
       ↓
   API Client
       ↓
    Backend`;

export const ARCHITECTURE_MUTATION_FLOW_CODE = `Page / Component
       ↓
   Composable
       ↓
    Mutation
       ↓
    Service
       ↓
   API Client
       ↓
    Backend`;

export const ARCHITECTURE_NEW_FEATURE_STEPS = [
  'Create the feature folder in app/features',
  'Add the required feature folders',
  'Create pages and feature components',
  'Add types and validation schemas',
  'Create services for API communication',
  'Add queries or mutations when needed',
  'Add route files in app/pages with definePageMeta',
] as const;

export const ARCHITECTURE_NEW_FEATURE_CODE = `📁 features/
└── 📁 products/
    ├── 📁 components/
    ├── 📁 composables/
    ├── 📁 constants/
    ├── 📁 mutations/
    ├── 📁 schemas/
    ├── 📁 services/
    └── 📄 types.ts
📁 pages/
└── 📁 products/
    └── 📄 index.vue`;

export const ARCHITECTURE_PRINCIPLES = [
  {
    title: 'Feature Isolation',
    description:
      'Keep feature-specific code inside its own feature folder instead of spreading it across the application.',
  },
  {
    title: 'Shared Reusability',
    description:
      'Move functionality used by multiple features into shared components, composables, services, or utilities.',
  },
  {
    title: 'Separation of Concerns',
    description:
      'Keep UI, business logic, API operations, and validation in their appropriate layers.',
  },
  {
    title: 'Consistent Conventions',
    description:
      'Follow the existing project structure when adding new features so the codebase stays predictable.',
  },
] as const;
