export type AppEnvironment = 'development' | 'production' | 'staging';

/** Validated public runtime config. Built from `runtimeConfig.public` in nuxt.config.ts. */
export interface AppEnvConfig {
  apiBaseUrl: string;
  appEnv: AppEnvironment;
  enableDevtools: boolean;
}
