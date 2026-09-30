import { DEFAULT_LOCALE } from '@workspace/locales';

export interface WebsiteConfig {
  apiBaseUrl: string;
  nodeEnv: string;
  appTitle: string;
  appName: string;
  appEnv: string;
  env: string;
  defaultLocale: string;
  enableDevtools: boolean;
}

/**
 * Accesses website application configuration from Nuxt runtimeConfig.
 */
export const getWebsiteConfig = (): WebsiteConfig => {
  const runtimeConfig = useRuntimeConfig();
  return {
    apiBaseUrl: (runtimeConfig.public.apiBaseUrl as string) || '',
    appTitle: 'Vue Monorepo Website',
    appName: runtimeConfig.public.appName,
    appEnv: process.env.NODE_ENV || 'development',
    env: process.env.NODE_ENV || 'development',
    nodeEnv: process.env.NODE_ENV || 'development',
    defaultLocale: DEFAULT_LOCALE,
    enableDevtools: process.env.NODE_ENV !== 'production',
  };
};

export default getWebsiteConfig;
