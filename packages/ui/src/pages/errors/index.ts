export const defaultErrorComponents = {
  accessDeniedComponent: () => import('./AccessDenied.vue'),
  serverErrorComponent: () => import('./InternalServerError.vue'),
  noInternetComponent: () => import('./NoInternet.vue'),
  notFoundComponent: () => import('./NotFound.vue'),
};
