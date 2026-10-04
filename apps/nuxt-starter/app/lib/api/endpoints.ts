import { route as ziggyRoute } from 'ziggy-js';
import type { Config, RouteParams } from 'ziggy-js';

const apiBaseUrl = '';
const routes = {
  // USERS
  'users.list': { uri: 'users', methods: ['GET'] },
  'users.create': { uri: 'users', methods: ['POST'] },
  'users.detail': { uri: 'users/{id}', methods: ['GET'] },
  'users.edit': { uri: 'users/{id}', methods: ['PATCH'] },
  'users.delete': { uri: 'users/{id}', methods: ['DELETE'] },

  'auth.login': { uri: 'login', methods: ['POST'] },
  'auth.logout': { uri: 'logout', methods: ['POST'] },
  'auth.refresh-token': { uri: 'refresh-token', methods: ['POST'] },
  'auth.profile': { uri: 'profile', methods: ['GET'] },

  // STARTER
  'starter.profile': { uri: 'starter/profile', methods: ['GET'] },

  // STORAGE
  'storage.presigned-url': { uri: 'storage/presigned-url', methods: ['POST'] },

  // The routes below serve the assets and tokenization features.
  // Their URIs are placeholders until the backend contract is confirmed.

  // NETWORKS
  'networks.list': { uri: 'networks', methods: ['GET'] },

  // ASSETS
  'assets.list': { uri: 'assets', methods: ['GET'] },
  'assets.all': { uri: 'assets/all', methods: ['GET'] },
  'assets.toggle-status': { uri: 'assets/{id}/toggle-status', methods: ['PATCH'] },
  'assets.create-custom-token': { uri: 'assets/custom-token', methods: ['POST'] },
  'assets.contract-details': { uri: 'assets/contract-details', methods: ['GET'] },
  'assets.add-available': { uri: 'assets/available', methods: ['POST'] },

  // TOKENIZATION
  'tokenization.list': { uri: 'tokens', methods: ['GET'] },
  'tokenization.show': { uri: 'tokens/{id}', methods: ['GET'] },
  'tokenization.create': { uri: 'tokens', methods: ['POST'] },
  'tokenization.verify': { uri: 'tokens/{id}/verify', methods: ['PATCH'] },
  'tokenization.networks': { uri: 'tokens/networks', methods: ['GET'] },

  // GAS STATION
  'gas-station.categories': { uri: 'gas-station/categories', methods: ['GET'] },
  'gas-station.wallets': { uri: 'gas-station/wallets', methods: ['GET'] },

  // VAULTS
  'vaults.list': { uri: 'vaults', methods: ['GET'] },
  'vaults.master-wallets': { uri: 'vaults/{id}/master-wallets', methods: ['GET'] },
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
  return ziggyRoute(name, params, absolute ?? true, Ziggy) as string;
}
