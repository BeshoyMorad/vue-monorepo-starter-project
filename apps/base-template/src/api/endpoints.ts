import { createApiRoute, type ZiggyConfig } from '@workspace/core/lib';

export const routes = {
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
  'starter.profile': { uri: 'starter/profile', methods: ['GET'] },

  // STORAGE
  'storage.presigned-url': { uri: 'storage/presigned-url', methods: ['POST'] },
} as const satisfies ZiggyConfig['routes'];

export const Ziggy: ZiggyConfig = {
  url: '',
  port: null,
  defaults: {},
  routes,
};

export type ApiRoutes = typeof routes;
export const apiRoute = createApiRoute(Ziggy);
