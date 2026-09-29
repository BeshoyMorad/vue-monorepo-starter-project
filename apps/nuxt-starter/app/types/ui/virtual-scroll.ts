import type { Ref } from 'vue';

export interface UseVirtualScrollOptions<T extends unknown[] = unknown[]> {
  containerRef: Ref<HTMLElement | null>;
  items: Ref<T> | (() => T);
  itemHeight: Ref<number> | (() => number) | number;
  overscan?: Ref<number> | (() => number) | number;
  enabled?: Ref<boolean> | (() => boolean) | boolean;
}

export interface UseVirtualScrollReturn<T extends unknown[] = unknown[]> {
  scrollTop: Ref<number>;
  containerHeight: Ref<number>;
  totalItems: Ref<number>;
  totalHeight: Ref<number>;
  startIndex: Ref<number>;
  endIndex: Ref<number>;
  visibleItems: Ref<T>;
  offsetTop: Ref<number>;
}
