import { useEffect, useRef } from 'react';

export function usePolling<T>(
  callback: () => Promise<T> | void,
  interval: number = 5000,
  enabled: boolean = true
) {
  const savedCallback = useRef<() => Promise<T> | void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    tick(); // Ejecutar inmediatamente
    const id = setInterval(tick, interval);

    return () => clearInterval(id);
  }, [interval, enabled]);
}

