import * as yup from 'yup';
import type { AppEnvConfig } from '@/types/config';

const envSchema: yup.ObjectSchema<AppEnvConfig> = yup.object({
  apiBaseUrl: yup
    .string()
    .url('NUXT_PUBLIC_API_BASE_URL must be a valid URL')
    .required('NUXT_PUBLIC_API_BASE_URL is required'),
  appEnv: yup
    .mixed<AppEnvConfig['appEnv']>()
    .oneOf(['development', 'production', 'staging'])
    .default('development'),
  enableDevtools: yup
    .boolean()
    .transform((_value, original: unknown) => String(original) === 'true')
    .default(false),
});

let cachedConfig: AppEnvConfig | null = null;

/**
 * Validated public runtime config.
 * Values come from `runtimeConfig.public` and can be overridden at runtime with
 * `NUXT_PUBLIC_API_BASE_URL`, `NUXT_PUBLIC_APP_ENV` and `NUXT_PUBLIC_ENABLE_DEVTOOLS`.
 * Throws on the first call if a value is missing or invalid, so misconfiguration fails fast.
 */
export function getEnvConfig(): AppEnvConfig {
  if (cachedConfig) return cachedConfig;

  try {
    cachedConfig = envSchema.validateSync(useRuntimeConfig().public, {
      abortEarly: false,
      stripUnknown: true,
    });
    return cachedConfig;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      // eslint-disable-next-line no-console
      console.error('❌ Invalid or missing environment variables:');
      error.inner.forEach((err) => {
        // eslint-disable-next-line no-console
        console.error(`   - ${err.path}: ${err.message}`);
      });
    }
    throw new Error('Fix environment variables before starting the application.', {
      cause: error,
    });
  }
}
