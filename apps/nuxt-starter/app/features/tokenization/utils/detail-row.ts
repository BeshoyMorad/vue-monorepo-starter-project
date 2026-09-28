/** One label/value row in the token details panel. */
export interface DetailRow {
  label: string;
  /** Full value, used for copying and the tooltip. */
  value: string | null;
  /** Value shown in the row, often shortened. Falls back to `value`. */
  valueToShow: string | null;
  copy: boolean;
  tooltip: boolean;
  testId: string;
}

const MAX_ERROR_LENGTH = 60;

/** Shortens a long error message for display and keeps the full text for copying. */
export function truncateError(
  message: string | null,
  maxLength: number = MAX_ERROR_LENGTH
): { display: string | null; full: string | null } {
  if (!message) return { display: null, full: null };
  const display = message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
  return { display, full: message };
}
