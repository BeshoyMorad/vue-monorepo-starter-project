import { nextTick } from 'vue';

/**
 * Moves keyboard and screen reader focus to the first field marked invalid, once the error
 * messages have rendered. Its error is then read out (fields reference their message via
 * aria-describedby). Pass as vee-validate's `onInvalidSubmit`, and call after setting
 * server-side field errors.
 */
export async function focusFirstInvalidField() {
  await nextTick();
  if (import.meta.server) {
    return;
  }
  document.querySelector<HTMLElement>('main [aria-invalid="true"]')?.focus();
}

/**
 * Focuses a heading so screen readers announce a new screen (after client-side navigation or
 * a step change), instead of focus being lost when the previous content is removed.
 */
export function focusHeading(heading: HTMLElement | null | undefined) {
  if (!heading) {
    return;
  }
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}
