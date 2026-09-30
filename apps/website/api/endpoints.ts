import { createApiRoute, type ZiggyConfig } from '@workspace/core/lib';

export const routes = {
  // USERS
  'users.list': { uri: 'users', methods: ['GET'] },
  'users.detail': { uri: 'users/{id}', methods: ['GET'] },

  // AUTH
  'auth.login': { uri: 'login', methods: ['POST'] },
  'auth.logout': { uri: 'logout', methods: ['POST'] },
  'auth.profile': { uri: 'profile', methods: ['GET'] },
} as const satisfies ZiggyConfig['routes'];

export const Ziggy: ZiggyConfig = {
  url: '',
  port: null,
  defaults: {},
  routes,
};

export type WebsiteApiRoutes = typeof routes;
export const apiRoute = createApiRoute(Ziggy);
