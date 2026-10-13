import type { RouteRecordRaw, RouteComponent } from 'vue-router';
import { defaultErrorComponents } from '@workspace/ui';
import { basePaths } from './paths';

export interface BaseRouteComponents {
  accessDeniedComponent?: RouteComponent | (() => Promise<RouteComponent>);
  serverErrorComponent?: RouteComponent | (() => Promise<RouteComponent>);
  noInternetComponent?: RouteComponent | (() => Promise<RouteComponent>);
  notFoundComponent?: RouteComponent | (() => Promise<RouteComponent>);
}

export function createErrorRoutes(components?: BaseRouteComponents): RouteRecordRaw[] {
  const resolved = {
    ...defaultErrorComponents,
    ...components,
  };

  const routes: RouteRecordRaw[] = [];

  if (resolved.accessDeniedComponent) {
    routes.push({
      path: '/access-denied',
      name: basePaths.errors.accessDenied,
      component: resolved.accessDeniedComponent,
      meta: { title: 'Access Denied' },
    });
  }

  if (resolved.serverErrorComponent) {
    routes.push({
      path: '/internal-server-error',
      name: basePaths.errors.serverError,
      component: resolved.serverErrorComponent,
      meta: { title: 'Internal Server Error' },
    });
  }

  if (resolved.noInternetComponent) {
    routes.push({
      path: '/no-internet',
      name: basePaths.errors.noInternet,
      component: resolved.noInternetComponent,
      meta: { title: 'No Internet Connection' },
    });
  }

  if (resolved.notFoundComponent) {
    routes.push({
      path: '/:pathMatch(.*)*',
      name: basePaths.errors.notFound,
      component: resolved.notFoundComponent,
      meta: { title: 'Page Not Found' },
    });
  }

  return routes;
}

/**
 * Creates standard base error routes, defaulting to shared error components if not provided.
 */
export function createBaseRoutes(components?: BaseRouteComponents): RouteRecordRaw[] {
  return createErrorRoutes(components);
}
