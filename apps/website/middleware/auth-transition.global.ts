/**
 * Switching language changes the URL (/auth/login → /ar/auth/login), which would replay
 * the auth page transition (AUTH_TRANSITION) for what is the same screen. For that
 * navigation, <html data-auth-instant> turns the transition off in CSS; any other
 * navigation clears it.
 *
 * Not done via `to.meta.pageTransition`: the leaving page keeps the transition settings of
 * the route it was entered with, so changing the new route's meta only affects the enter.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) {
    return;
  }
  const getRouteBaseName = useRouteBaseName();
  const sameScreen = getRouteBaseName(to) === getRouteBaseName(from);
  document.documentElement.toggleAttribute('data-auth-instant', sameScreen);
});
