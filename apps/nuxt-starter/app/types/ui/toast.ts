export type ToastVariant = 'info' | 'success' | 'error' | 'warn';

export interface ToastOptions {
  title?: string;
  body?: string;
  action?: () => void;
}
