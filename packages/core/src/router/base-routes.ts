import type { RouteRecordRaw, RouteComponent, NavigationGuard } from 'vue-router';
import { basePaths } from './paths';

export interface BaseRouteComponents {
  authLayout?: RouteComponent | (() => Promise<RouteComponent>);
  loginComponent?: RouteComponent | (() => Promise<RouteComponent>);
  settingsComponent?: RouteComponent | (() => Promise<RouteComponent>);
  profileComponent?: RouteComponent | (() => Promise<RouteComponent>);
  accessDeniedComponent?: RouteComponent | (() => Promise<RouteComponent>);
  serverErrorComponent?: RouteComponent | (() => Promise<RouteComponent>);
  noInternetComponent?: RouteComponent | (() => Promise<RouteComponent>);
  notFoundComponent?: RouteComponent | (() => Promise<RouteComponent>);
}

export interface BaseRouteGuards {
  authGuard?: NavigationGuard;
  guestGuard?: NavigationGuard;
}

function createAuthRoutes(
  components: BaseRouteComponents,
  guards: BaseRouteGuards
): RouteRecordRaw[] {
  if (!components.loginComponent) return [];

  const beforeEnter = guards.guestGuard ? [guards.guestGuard] : undefined;

  if (components.authLayout) {
    return [
      {
        path: '/auth',
        component: components.authLayout,
        beforeEnter,
        children: [
          {
            path: 'login',
            name: basePaths.auth.login,
            component: components.loginComponent,
            meta: { title: 'Sign In', sidebar: false },
          },
        ],
      },
    ];
  }

  return [
    {
      path: '/login',
      name: basePaths.auth.login,
      component: components.loginComponent,
      beforeEnter,
      meta: { title: 'Sign In', sidebar: false },
    },
  ];
}

function createSystemRoutes(
  components: BaseRouteComponents,
  guards: BaseRouteGuards
): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];
  const beforeEnter = guards.authGuard ? [guards.authGuard] : undefined;

  if (components.settingsComponent) {
    routes.push({
      path: '/settings',
      name: basePaths.system.settings,
      component: components.settingsComponent,
      beforeEnter,
      meta: { title: 'Settings', sidebar: true },
    });
  }

  if (components.profileComponent) {
    routes.push({
      path: '/profile',
      name: basePaths.system.profile,
      component: components.profileComponent,
      beforeEnter,
      meta: { title: 'Profile', sidebar: true },
    });
  }

  return routes;
}

function createErrorRoutes(components: BaseRouteComponents): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];

  if (components.accessDeniedComponent) {
    routes.push({
      path: '/access-denied',
      name: basePaths.errors.accessDenied,
      component: components.accessDeniedComponent,
      meta: { title: 'Access Denied', sidebar: false },
    });
  }

  if (components.serverErrorComponent) {
    routes.push({
      path: '/internal-server-error',
      name: basePaths.errors.serverError,
      component: components.serverErrorComponent,
      meta: { title: 'Internal Server Error', sidebar: false },
    });
  }

  if (components.noInternetComponent) {
    routes.push({
      path: '/no-internet',
      name: basePaths.errors.noInternet,
      component: components.noInternetComponent,
      meta: { title: 'No Internet Connection', sidebar: false },
    });
  }

  if (components.notFoundComponent) {
    routes.push({
      path: '/:pathMatch(.*)*',
      name: basePaths.errors.notFound,
      component: components.notFoundComponent,
      meta: { title: 'Page Not Found', sidebar: false },
    });
  }

  return routes;
}

/**
 * Creates standard base routes with optional application-level guards.
 */
export function createBaseRoutes(
  components: BaseRouteComponents = {},
  guards: BaseRouteGuards = {}
): RouteRecordRaw[] {
  return [
    ...createAuthRoutes(components, guards),
    ...createSystemRoutes(components, guards),
    ...createErrorRoutes(components),
  ];
}
