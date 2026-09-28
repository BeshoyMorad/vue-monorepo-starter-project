import { z } from 'zod';

export const baseEnvSchema = z.object({
  VITE_API_BASE_URL: z
    .string({ required_error: 'VITE_API_BASE_URL is required' })
    .url({ message: 'VITE_API_BASE_URL must be a valid URL (e.g. https://api.example.com)' }),
  VITE_APP_TITLE: z.string().default('Vue Monorepo Application'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  VITE_DEFAULT_LOCALE: z.enum(['en', 'ar']).default('en'),
  VITE_ENABLE_DEVTOOLS: z
    .union([z.boolean(), z.string()])
    .transform((val) => String(val) === 'true')
    .default(false),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;

/**
 * Creates an environment validator extending the base schema with app-specific keys.
 */
export function createEnvValidator<T extends z.ZodRawShape>(customShape?: T) {
  const schema = customShape ? baseEnvSchema.extend(customShape) : baseEnvSchema;

  return function validateEnv(
    rawEnv: Record<string, unknown> = (import.meta as unknown as { env: Record<string, unknown> })
      .env
  ): z.infer<typeof schema> {
    const result = schema.safeParse(rawEnv);

    if (!result.success) {
      const formattedErrors = result.error.errors
        .map((err) => `  ✖ ${err.path.join('.')}: ${err.message}`)
        .join('\n');

      const banner = `\n==============================================================\n❌ [STARTUP CONFIG ERROR] Invalid or missing Environment Variables:\n${formattedErrors}\n==============================================================\n`;
      // eslint-disable-next-line no-console
      console.error(banner);
      throw new Error(
        `[EnvValidationFailed]: Ensure all required environment variables are set in your local .env file.\n${formattedErrors}`
      );
    }

    return result.data;
  };
}

export const validateEnv = createEnvValidator();
