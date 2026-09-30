/// <reference types="vite/client" />
import type { RowData } from '@tanstack/table-core';

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    colSpan?: number;
  }
}

declare module '@tanstack/vue-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    colSpan?: number;
  }
}
