import { focusHeading } from '~/utils/focus';

/**
 * Moving between profile pages (overview ↔ account settings): only the content area
 * changes, fading out and the new page fading in from slightly below (as on the auth
 * screens). The new page's heading then takes focus so screen readers announce it.
 */
export const PROFILE_TRANSITION = {
  name: 'profile-swap',
  mode: 'out-in',
  onAfterEnter: (el: Element) => focusHeading(el.querySelector('h1')),
} as const;

/**
 * Moving between the steps of a dialog (change password, phone, email, IBAN): the auth
 * step animation; then the new step's first field takes focus, since the button that
 * moved on is gone.
 */
export const DIALOG_STEP_TRANSITION = {
  name: 'auth-step',
  mode: 'out-in',
  onAfterEnter: (el: Element) =>
    el.querySelector<HTMLElement>('input:not([type=hidden]), select, textarea, button')?.focus(),
} as const;
