'use client';

import { useEffect, useState } from 'react';

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<{ data?: T; error?: Error; loading: boolean }>({ loading: true });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: undefined }));
    fn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ error, loading: false });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { ...state, reload: () => setTick((t) => t + 1) };
}

/** Counts down from `initialMs`. Returns null until mounted, so server and client markup match. */
export function useCountdown(initialMs: number): number | null {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = Date.now() + initialMs;
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [initialMs]);
  return left;
}
