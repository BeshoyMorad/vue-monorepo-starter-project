import { route as ziggyRoute } from 'ziggy-js';
import type { Config, RouteParams } from 'ziggy-js';

export type { Config as ZiggyConfig, RouteParams };

/**
 * Creates an application-specific type-safe apiRoute helper.
 *
 * Each consumer application defines its own endpoints and initializes its
 * router helper via `createApiRoute(config)`.
 */
export function createApiRoute<TConfig extends Config>(ziggyConfig: TConfig) {
  return function apiRoute<
    T extends Extract<keyof TConfig['routes'], string> = Extract<keyof TConfig['routes'], string>,
  >(name: T, params?: RouteParams<T>, absolute?: boolean): string {
    return ziggyRoute(name as string, params as never, absolute ?? false, ziggyConfig) as string;
  };
}
