import { validateEnv, baseEnvSchema, type BaseEnv, createEnvValidator } from '@workspace/core/env';

export { validateEnv, baseEnvSchema, type BaseEnv, createEnvValidator };

const env = import.meta.env;

export const config = {
  get apiBaseUrl() {
    return env.VITE_API_BASE_URL || '';
  },
  get env() {
    return env.VITE_APP_ENV || 'development';
  },
  get enableDevtools() {
    return String(env.VITE_ENABLE_DEVTOOLS) === 'true';
  },
};
