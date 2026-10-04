import { createApiRoute, type ZiggyConfig } from '@workspace/core/lib';

export const routes = {
  // USERS
  'users.list': { uri: 'users', methods: ['GET'] },
  'users.detail': { uri: 'users/{id}', methods: ['GET'] },

  // AUTH (customers)
  'auth.customers.login': { uri: 'auth/customers/login', methods: ['POST'] },
  'auth.customers.register': { uri: 'auth/customers/register', methods: ['POST'] },
  'auth.contact.verify': { uri: 'auth/contact/verify', methods: ['POST'] },
  'auth.contact.send': { uri: 'auth/contact/send', methods: ['POST'] },
  'auth.otp.resend': { uri: 'auth/otp/resend', methods: ['POST'] },
  'auth.password.forgot': { uri: 'auth/password/forgot', methods: ['POST'] },
  'auth.password.forgot.verify': { uri: 'auth/password/forgot/verify', methods: ['POST'] },
  'auth.password.reset': { uri: 'auth/password/reset', methods: ['POST'] },
  'auth.password.update': { uri: 'auth/password', methods: ['PUT'] },
  'auth.refresh-token': { uri: 'auth/refresh-token', methods: ['POST'] },
  'auth.logout': { uri: 'auth/logout', methods: ['POST'] },
} as const satisfies ZiggyConfig['routes'];

export const Ziggy = {
  url: '',
  port: null,
  defaults: {},
  routes,
} as const satisfies ZiggyConfig;

export type WebsiteApiRoutes = typeof routes;
export const apiRoute = createApiRoute(Ziggy);
