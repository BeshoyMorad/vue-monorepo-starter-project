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

  // CUSTOMER ACCOUNT (signed-in customer)
  'customer.profile': { uri: 'customers/current-user/profile', methods: ['GET', 'PATCH'] },
  'customer.account': { uri: 'customers/current-user/account', methods: ['GET'] },
  'customer.delete': { uri: 'customers/current-user', methods: ['DELETE'] },
  'customer.contact': { uri: 'customers/current-user/contact', methods: ['POST', 'PUT'] },
  'customer.iban': { uri: 'customers/current-user/iban', methods: ['POST', 'PUT'] },
  'customer.stats.marketplace': { uri: 'marketplace/customers/statistics', methods: ['GET'] },
  'customer.stats.veterinary': { uri: 'veterinary/customers/statistics', methods: ['GET'] },
  'customer.stats.insurance': { uri: 'insurance/customers/statistics', methods: ['GET'] },
  'customer.stats.transportation': {
    uri: 'transportation/customers/statistics',
    methods: ['GET'],
  },

  // UPLOADS: multipart, field `file`; answers with the public URL of the stored image
  'uploads.image': { uri: 'uploads/image', methods: ['POST'] },

  // SEARCH (public; history is customers only)
  search: { uri: 'user/search', methods: ['GET'] },
  'search.suggestions': { uri: 'user/search/suggestions', methods: ['GET'] },
  'search.history': { uri: 'user/search-history', methods: ['GET', 'DELETE'] },
  'search.history.entry': { uri: 'user/search-history/{id}', methods: ['DELETE'] },
} as const satisfies ZiggyConfig['routes'];

export const Ziggy: ZiggyConfig = {
  url: '',
  port: null,
  defaults: {},
  routes,
};

export type WebsiteApiRoutes = typeof routes;
export const apiRoute = createApiRoute(Ziggy);
