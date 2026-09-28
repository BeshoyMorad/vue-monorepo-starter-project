/// <reference types="vite/client" />

declare module '*.css';
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}

import type { RowData } from '@tanstack/vue-table';

declare module '@tanstack/vue-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'center' | 'right';
    width?: string;
    colSpan?: number;
  }
}
