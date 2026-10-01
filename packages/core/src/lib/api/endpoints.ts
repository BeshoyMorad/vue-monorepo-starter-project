import { route as ziggyRoute } from 'ziggy-js';
import type { Config } from 'ziggy-js';

export interface ZiggyConfig {
  url?: string;
  port?: number | null;
  defaults?: Record<string, unknown>;
  routes: Record<string, { uri: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

type ExtractParam<T extends string> = T extends `${string}{${infer P}}${infer R}`
  ? (P extends `${string}?` ? never : P & string) | ExtractParam<R>
  : never;

export type RouteParams<T extends string = string> = {
  [K in ExtractParam<T>]: string | number;
} & Record<string, unknown>;

/**
 * Creates an application-specific type-safe apiRoute helper from a Ziggy config object.
 */
export function createApiRoute<const TConfig extends ZiggyConfig>(ziggyConfig: TConfig) {
  return function apiRoute<TName extends keyof TConfig['routes']>(
    name: TName,
    ...args: [ExtractParam<TConfig['routes'][TName]['uri']>] extends [never]
      ? [params?: Record<string, unknown>, absolute?: boolean]
      : [params: RouteParams<TConfig['routes'][TName]['uri']> | string | number, absolute?: boolean]
  ): string {
    return ziggyRoute(
      name as string,
      args[0] as never,
      (args[1] as boolean | undefined) ?? false,
      ziggyConfig as unknown as Config
    ) as string;
  };
}
