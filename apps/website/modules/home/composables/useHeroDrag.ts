import type { Ref } from 'vue';

/** Share of the banner's width the drag must pass to change the slide on release */
const COMMIT_SHARE = 0.2;
/** A quick flick (px per ms) changes the slide even when it's shorter than COMMIT_SHARE */
const FLICK_SPEED = 0.5;
/** Movement before a press counts as a drag, so clicks on links and dots still work */
const SLOP = 8;
/** Matches the settle transition in HeroBanner's styles */
export const SETTLE_MS = 350;

/** Where a press started and how fast the pointer is moving, for one drag gesture */
function createGesture() {
  const g = { id: -1, startX: 0, startY: 0, lastX: 0, lastT: 0, velocity: 0, moved: false };
  return {
    g,
    begin(e: PointerEvent) {
      Object.assign(g, { id: e.pointerId, startX: e.clientX, startY: e.clientY });
      Object.assign(g, { lastX: e.clientX, lastT: e.timeStamp, velocity: 0, moved: false });
    },
    /** Records a move; returns the horizontal distance from the start */
    track(e: PointerEvent) {
      const dt = e.timeStamp - g.lastT;
      if (dt > 0) g.velocity = (e.clientX - g.lastX) / dt;
      g.lastX = e.clientX;
      g.lastT = e.timeStamp;
      return e.clientX - g.startX;
    },
    /** True once the press has moved far enough sideways to count as a drag */
    isHorizontalDrag(e: PointerEvent) {
      const dx = Math.abs(e.clientX - g.startX);
      return dx >= SLOP && Math.abs(e.clientY - g.startY) <= dx;
    },
  };
}

/** Swallows the click a browser fires after a drag, so it doesn't follow a link or press a dot */
function createClickGuard() {
  let armed = false;
  return {
    arm() {
      armed = true;
      setTimeout(() => (armed = false));
    },
    onClickCapture(e: MouseEvent) {
      if (!armed) return;
      e.preventDefault();
      e.stopPropagation();
    },
  };
}

/**
 * Inline position of a photo while dragging: `shift` is its place in slide widths (0 current,
 * ±100 the peeking neighbour), `offset` the drag distance in px.
 */
function dragTransform(offset: number, shift: number, settling: boolean) {
  return {
    transform: `translateX(calc(${offset}px + ${shift}%))`,
    transition: settling ? `transform ${SETTLE_MS}ms ease-out` : 'none',
  };
}

/** Live drag state shared by the pointer handlers and the banner */
function createDragState() {
  return {
    /** Horizontal drag distance in px (screen direction) */
    offset: ref(0),
    /** Neighbour slide shown beside the current one, or null when not dragging */
    peek: ref<number | null>(null),
    /** 1 when the drag reveals the next slide, -1 for the previous one */
    towards: ref<1 | -1>(1),
    /** True from the moment a press becomes a drag until the slide has settled */
    active: ref(false),
    /** True while the photos animate to their resting place after release */
    settling: ref(false),
    /** Reading direction (1 ltr, -1 rtl) and banner width, measured when a press starts */
    dir: 1 as 1 | -1,
    width: 0,
  };
}
type DragState = ReturnType<typeof createDragState>;

/** Pointer handlers: turn a sideways press into a drag, then settle it on release */
function createListeners(
  el: Ref<HTMLElement | null>,
  state: DragState,
  neighbour: (towards: 1 | -1) => number,
  settle: (change: boolean) => void,
  onDragEnd: () => void
) {
  const { g, begin, track, isHorizontalDrag } = createGesture();
  const { offset, peek, towards, active, settling } = state;
  return {
    pointerdown(e: PointerEvent) {
      if (settling.value || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
      if (!el.value) return;
      begin(e);
      state.width = el.value.clientWidth;
      state.dir = getComputedStyle(el.value).direction === 'rtl' ? -1 : 1;
    },
    pointermove(e: PointerEvent) {
      if (e.pointerId !== g.id) return;
      if (!g.moved) {
        // Too short, or mostly vertical (the page scrolls; touch does so via touch-action: pan-y)
        if (!isHorizontalDrag(e)) return;
        g.moved = active.value = true;
        el.value?.setPointerCapture(e.pointerId);
      }
      const dx = track(e);
      offset.value = Math.max(-state.width, Math.min(state.width, dx));
      towards.value = dx * state.dir < 0 ? 1 : -1;
      peek.value = neighbour(towards.value);
    },
    pointerup(e: PointerEvent) {
      if (e.pointerId !== g.id) return;
      g.id = -1;
      if (!g.moved) return;
      onDragEnd();
      const flicked =
        Math.abs(g.velocity) > FLICK_SPEED && Math.sign(g.velocity) === Math.sign(offset.value);
      settle(Math.abs(offset.value) > state.width * COMMIT_SHARE || flicked);
    },
    pointercancel(e: PointerEvent) {
      if (e.pointerId !== g.id) return;
      g.id = -1;
      if (g.moved) settle(false);
    },
  };
}

/**
 * Drag / swipe for the hero carousel (mouse, touch and pen through pointer events).
 * While dragging, the current photo follows the pointer and the neighbour on that side peeks in.
 * On release it settles onto the neighbour (past COMMIT_SHARE or flicked) or springs back,
 * then calls `commit`. Directions follow the reading direction, so in Arabic dragging right
 * goes forward.
 */
export function useHeroDrag(
  el: Ref<HTMLElement | null>,
  index: Ref<number>,
  total: number,
  commit: (n: number, towards: 1 | -1) => void
) {
  const state = createDragState();
  const { offset, peek, towards, active, settling } = state;
  const clickGuard = createClickGuard();
  let timer: ReturnType<typeof setTimeout> | undefined;

  function settle(change: boolean) {
    settling.value = true;
    offset.value = change ? -towards.value * state.dir * state.width : 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer = setTimeout(
      async () => {
        settling.value = false;
        // The peeking photo already sits where the new slide rests, so the swap must be instant:
        // `active` stays true for this render so the banner skips its slide transition.
        if (change && peek.value !== null) commit(peek.value, towards.value);
        offset.value = 0;
        peek.value = null;
        await nextTick();
        active.value = false;
      },
      reduced ? 0 : SETTLE_MS
    );
  }

  const neighbour = (step: 1 | -1) => (index.value + step + total) % total;
  const listeners = createListeners(el, state, neighbour, settle, clickGuard.arm);

  /** Inline position of a photo while dragging; undefined lets the normal transitions run */
  function frameStyle(n: number) {
    if (!active.value) return undefined;
    const shift = n === index.value ? 0 : n === peek.value ? towards.value * state.dir * 100 : null;
    return shift === null ? undefined : dragTransform(offset.value, shift, settling.value);
  }

  onBeforeUnmount(() => clearTimeout(timer));

  return { active, peek, frameStyle, listeners, onClickCapture: clickGuard.onClickCapture };
}
