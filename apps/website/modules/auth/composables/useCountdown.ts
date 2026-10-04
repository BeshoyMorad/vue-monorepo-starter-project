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

  const start = () => {
    stop();
    remaining.value = seconds;
    if (import.meta.server) {
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
