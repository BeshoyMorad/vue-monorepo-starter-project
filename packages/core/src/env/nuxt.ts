import { z } from 'zod';

export const nuxtEnvSchema = z.object({
  NUXT_PUBLIC_API_BASE_URL: z
    .string()
    .url({ message: 'NUXT_PUBLIC_API_BASE_URL must be a valid URL (e.g. https://api.example.com)' })
    .default('https://api.example.com'),
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
});

export type NuxtEnv = z.infer<typeof nuxtEnvSchema>;

/**
 * Validates Nuxt environment variables (process.env) at startup.
 */
export function validateNuxtEnv(
  rawEnv: Record<string, unknown> = ((
    globalThis as unknown as { process?: { env?: Record<string, unknown> } }
  ).process?.env ?? {}) as Record<string, unknown>
): NuxtEnv {
  const result = nuxtEnvSchema.safeParse(rawEnv);

  if (!result.success) {
    const formattedErrors = result.error.errors
      .map((err) => `  ✖ ${err.path.join('.')}: ${err.message}`)
      .join('\n');

    const banner = `\n==============================================================\n❌ [STARTUP CONFIG ERROR] Invalid or missing Nuxt Environment Variables:\n${formattedErrors}\n==============================================================\n`;
    // eslint-disable-next-line no-console
    console.error(banner);
    throw new Error(
      `[EnvValidationFailed]: Ensure all required environment variables are set in your local .env file.\n${formattedErrors}`
    );
  }

  return result.data;
}
