export const ENV_DOM = {
  title: 'Environment Variables',

  description:
    'Environment variables provide configuration values for the application. Nuxt reads them into runtimeConfig, and app/config/env.ts validates them and exposes the final values through getEnvConfig().',

  structure: {
    title: 'Environment Configuration',
    description:
      'nuxt.config.ts declares the public runtime config keys and their defaults. The .env file overrides them, and app/config/env.ts validates the result.',
  },

  setup: {
    title: 'Environment File Setup',
    description:
      'The project reads environment values from a .env file located at the project root. New developers need to make sure the required variables exist before running the application.',

    howToUse:
      'Create or update the .env file in the project root and add the NUXT_PUBLIC_ variables. Nuxt maps NUXT_PUBLIC_API_BASE_URL to runtimeConfig.public.apiBaseUrl automatically, at build time and when the server starts.',
  },

  validation: {
    title: 'Environment Validation',
    description:
      'app/config/env.ts uses Yup to validate runtimeConfig.public before the application uses it.',

    howToUse:
      'The schema defines which values are required, which values are allowed, and which values have defaults. The api plugin calls getEnvConfig() during startup, so an invalid value stops the app immediately.',
  },

  usage: {
    title: 'Using the Configuration',
    description:
      'After validation, the values are returned by getEnvConfig(). Application code should use it instead of reading useRuntimeConfig() directly.',

    howToUse:
      'Import getEnvConfig from @/config/env and read the required value, such as getEnvConfig().apiBaseUrl or getEnvConfig().appEnv.',
  },

  errors: {
    title: 'Validation Errors',
    description:
      'If an environment variable is missing or has an invalid value, the validation fails, the errors are printed in the console, and the application does not continue starting.',
  },
} as const;

export const ENV_IMPORT_CODE = `import { getEnvConfig } from '@/config/env';`;

export const ENV_PROJECT_STRUCTURE = `
📁 project-root/
├── 📄 .env
├── 📄 nuxt.config.ts
├── 📁 app/
│   ├── 📁 config/
│   │   └── 📄 env.ts
│   └── 📁 types/
│       └── 📄 env.ts
└── 📄 package.json
`;

export const ENV_SETUP_CODE = `# .env

NUXT_PUBLIC_API_BASE_URL=https://api.example.com
NUXT_PUBLIC_APP_ENV=development
NUXT_PUBLIC_ENABLE_DEVTOOLS=true`;

export const ENV_SCHEMA_CODE = `import * as yup from 'yup';
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
});`;

export const ENV_VALIDATION_CODE = `export function getEnvConfig(): AppEnvConfig {
  if (cachedConfig) return cachedConfig;

  try {
    cachedConfig = envSchema.validateSync(useRuntimeConfig().public, {
      abortEarly: false,
      stripUnknown: true,
    });
    return cachedConfig;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error('❌ Invalid or missing environment variables:');
      error.inner.forEach((err) => {
        console.error(\`   - \${err.path}: \${err.message}\`);
      });
    }
    throw new Error('Fix environment variables before starting the application.', {
      cause: error,
    });
  }
}`;

export const ENV_USAGE_CODE = `import { getEnvConfig } from '@/config/env';

const { apiBaseUrl, appEnv, enableDevtools } = getEnvConfig();`;

export const ENV_ERROR_CODE = `❌ Invalid or missing environment variables:
   - apiBaseUrl: NUXT_PUBLIC_API_BASE_URL must be a valid URL

Error: Fix environment variables before starting the application.`;
