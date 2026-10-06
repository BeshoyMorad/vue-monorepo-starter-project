import { validateViteEnv, type ViteEnv } from '@workspace/core/env';

const env = validateViteEnv(import.meta.env);

export interface AppConfig {
  apiBaseUrl: string;
  usersApiBaseUrl: string;
  appTitle: string;
  appEnv: 'development' | 'staging' | 'production' | 'test';
  env: 'development' | 'staging' | 'production' | 'test';
  defaultLocale: 'en' | 'ar';
  enableDevtools: boolean;
  raw: ViteEnv;
}

export const config: AppConfig = {
  apiBaseUrl: env.VITE_API_BASE_URL,
  // Override this in apps/ap-dashboard/.env; the default points to the DummyJSON demo API.
  usersApiBaseUrl: import.meta.env.VITE_USERS_API_BASE_URL || 'https://dummyjson.com',
  appTitle: env.VITE_APP_TITLE,
  appEnv: env.VITE_APP_ENV,
  env: env.VITE_APP_ENV,
  defaultLocale: env.VITE_DEFAULT_LOCALE,
  enableDevtools: env.VITE_ENABLE_DEVTOOLS,
  raw: env,
};

export default config;
