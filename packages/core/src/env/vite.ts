import { z } from 'zod';

export const viteEnvSchema = z.object({
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

export type ViteEnv = z.infer<typeof viteEnvSchema>;

/**
 * Validates Vite environment variables against the schema.
 * Fails fast and logs formatted errors if any required variables are missing or invalid.
 */
export function validateViteEnv<T extends z.ZodRawShape = Record<string, never>>(
  rawEnv: Record<string, unknown> = (import.meta as unknown as { env: Record<string, unknown> })
    .env,
  customShape?: T
): ViteEnv & (T extends z.ZodRawShape ? z.infer<z.ZodObject<T>> : object) {
  const schema = customShape ? viteEnvSchema.extend(customShape) : viteEnvSchema;
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

  return result.data as ViteEnv & (T extends z.ZodRawShape ? z.infer<z.ZodObject<T>> : object);
}
