import { computed, onBeforeUnmount, ref } from 'vue';

/** Seconds countdown for "resend code" buttons. Runs in the browser only. */
export function useCountdown(seconds: number) {
  const remaining = ref(0);
  let timer: ReturnType<typeof setInterval> | undefined;

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };

  /** Starts (or resumes) the countdown; `from` defaults to the full duration. */
  const start = (from = seconds) => {
    stop();
    remaining.value = Math.max(0, from);
    if (import.meta.server || remaining.value === 0) {
      return;
    }
    timer = setInterval(() => {
      remaining.value -= 1;
      if (remaining.value <= 0) {
        remaining.value = 0;
        stop();
      }
    }, 1000);
  };

  onBeforeUnmount(stop);

  return { remaining, isRunning: computed(() => remaining.value > 0), start };
}
