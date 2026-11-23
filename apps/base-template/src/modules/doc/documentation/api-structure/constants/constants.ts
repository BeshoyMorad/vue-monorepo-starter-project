export const API_STRUCTURE_DOM = {
  title: 'API Structure',
  description:
    'A centralized structure for defining API routes and TanStack Query keys. Use these files as the single source of truth when working with API endpoints and query caching.',

  location: {
    title: 'Where is the API structure?',
    description:
      'API-related route definitions and query keys are located inside the src/lib/api directory. New developers can start from this folder when they need to find or add an API endpoint or query key.',
    path: 'src/lib/api/',
  },

  endpoints: {
    title: 'API Endpoints',
    description:
      'The endpoints.ts file contains the registered API routes used by the application. Routes are defined with Ziggy and exposed through apiRoute(), so API URLs do not need to be hard-coded throughout the application.',
    filePath: 'src/lib/api/endpoints.ts',
    howToUse:
      'Add or find the API route inside endpoints.ts, then use apiRoute() wherever the application needs to generate the endpoint URL.',
  },

  queryKeys: {
    title: 'Query Keys',
    description:
      'Query keys are built with @lukemorales/query-key-factory. Every module declares its own keys in <module>.keys.ts, and apps/base-template/src/api/query-keys.ts merges them into one typed queryKeys object. This prevents typos, gives autocomplete, and makes queries and invalidations target the same key.',
    filePath: 'apps/base-template/src/api/query-keys.ts',
    howToUse:
      'Define keys in the <module>.keys.ts file of the module with createQueryKeys, register them in apps/base-template/src/api/query-keys.ts, then read them as queryKeys.<module>.<key>.queryKey (or queryKeys.<module>.<key>(param).queryKey for keys with params). Use queryKeys.<module>._def to invalidate a whole module.',
  },
  services: {
    title: 'API Services',
    description:
      'API services contain the functions responsible for communicating with the backend. Each feature keeps its service methods inside its own module, while apiRoute() provides the endpoint and the shared api client handles the HTTP request.',
    filePath: 'src/modules/tokenization/services/index.ts',
    howToUse:
      'Create service functions inside the feature services folder. Use apiRoute() to get the endpoint, the shared api client to make the request, and TypeScript types to define the request and response data.',
  },
  structure: {
    title: 'Structure',
  },
} as const;

export const API_STRUCTURE_IMPORT_CODE = `import { api, apiRoute } from '@/api';
import { queryKeys } from '@/api/query-keys';`;

export const API_PROJECT_STRUCTURE = `📁 src/
├── 📁 api/
│   ├── 📄 endpoints.ts
│   └── 📄 query-keys.ts      (merges module keys)
└── 📁 modules/
    └── 📁 users/
        └── 📄 users.keys.ts  (createQueryKeys)`;

export const API_ENDPOINTS_CODE = `import { route as ziggyRoute } from 'ziggy-js';
import type { Config, RouteParams } from 'ziggy-js';

const apiBaseUrl = '';

const routes = {
  // USERS
  'users.list': { uri: 'users', methods: ['GET'] },
  'users.create': { uri: 'users', methods: ['POST'] },
  'users.detail': { uri: 'users/{id}', methods: ['GET'] },
  'users.edit': { uri: 'users/{id}', methods: ['PATCH'] },
  'users.delete': { uri: 'users/{id}', methods: ['DELETE'] },

  // AUTH
  'auth.login': { uri: 'login', methods: ['POST'] },
  'auth.logout': { uri: 'logout', methods: ['POST'] },
  'auth.refresh-token': { uri: 'refresh-token', methods: ['POST'] },
  'auth.profile': { uri: 'profile', methods: ['GET'] },

  // STARTER
  'starter.profile': {
    uri: 'starter/profile',
    methods: ['GET'],
  },

  // STORAGE
  'storage.presigned-url': {
    uri: 'storage/presigned-url',
    methods: ['POST'],
  },

  /* <-- ... Add new endpoints routes here --> */
  
} as const satisfies Config['routes'];

export const Ziggy: Config = {
  url: apiBaseUrl,
  port: null,
  defaults: {},
  routes,
};

type ApiRoutes = typeof routes;

export function apiRoute<T extends keyof ApiRoutes = keyof ApiRoutes>(
  name: T,
  params?: RouteParams<T>,
  absolute?: boolean
): string {
  return ziggyRoute(
    name,
    params,
    absolute ?? true,
    Ziggy
  ) as string;
}`;

export const API_ROUTE_USAGE_CODE = `import { api } from '@/api';
import { apiRoute } from '@workspace/core/lib/api/endpoints';

export const usersServices = {
  getUsers: async () => {
    const data = await api.get<ApiResponse<User[]>>(
      apiRoute('users.list')
    );
    return data;
  },

  createUser: async (payload: CreateUserPayload) => {
    const data = await api.post<ApiResponse<User>>(
      apiRoute('users.create'),
      payload
    );
    return data;
  },
};`;

export const API_QUERY_KEYS_CODE = `// apps/base-template/src/modules/users/users.keys.ts  (each module owns its keys)
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const usersKeys = createQueryKeys('users', {
  list: null,                                  // ['users', 'list']
  details: (id: number | string) => [id],      // ['users', 'details', id]
  search: (filters: { q: string }) => [{ filters }],
});

// apps/base-template/src/api/query-keys.ts  (only merges, never defines keys)
import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { authKeys } from '@/modules/auth/auth.keys';
import { starterKeys } from '@/modules/starter/starter.keys';
import { usersKeys } from '@/modules/users/users.keys';

export const queryKeys = mergeQueryKeys(authKeys, starterKeys, usersKeys);

// Cheat sheet
// queryKeys.users.list.queryKey          -> ['users', 'list']
// queryKeys.users.details(7).queryKey    -> ['users', 'details', 7]
// queryKeys.users._def                   -> ['users']  (whole module, for invalidation)`;

export const API_QUERY_KEYS_USAGE_CODE = `import { useQuery } from '@tanstack/vue-query';
import { usersServices } from '@/modules/users/services';
import { queryKeys } from '@/api/query-keys';

export function useUser() {

return useQuery({
  queryKey: queryKeys.users.list.queryKey,
  queryFn: usersServices.getUsers,
});`;

export const API_QUERY_KEYS_USAGE_CODE_MUTATION = `import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { usersServices } from '@/modules/users/services';
import { queryKeys } from '@/api/query-keys';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      usersServices.createUser(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.list.queryKey,
      });
    },
  });
}`;
