import type { Ref } from 'vue';

/**
 * Position of a highlight that glides to the current item of a list (by default the element
 * with aria-current="page"; the overview tabs use aria-pressed="true"). Measured from the DOM, so it follows RTL and horizontal layouts.
 * `null` until measured (server render, first paint): the items keep their own highlight.
 * `animate` turns on after the first placement, so it never glides in from a corner.
 */
export function useGlideMarker(
  list: Ref<HTMLElement | undefined>,
  current: () => unknown,
  selector = '[aria-current=page]'
) {
  const box = ref<{ x: number; y: number; w: number; h: number } | null>(null);
  const animate = ref(false);
  const measure = () => {
    const el = list.value?.querySelector<HTMLElement>(selector);
    box.value = el
      ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }
      : null;
  };

  let observer: ResizeObserver | undefined;
  onMounted(() => {
    measure();
    requestAnimationFrame(() => (animate.value = true));
    observer = new ResizeObserver(measure);
    if (list.value) observer.observe(list.value);
  });
  onBeforeUnmount(() => observer?.disconnect());
  watch(current, () => nextTick(measure));

  const style = computed(() =>
    box.value
      ? {
          transform: `translate(${box.value.x}px, ${box.value.y}px)`,
          width: `${box.value.w}px`,
          height: `${box.value.h}px`,
        }
      : undefined
  );
  return { box, animate, style };
}
