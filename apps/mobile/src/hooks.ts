import { useEffect, useState } from 'react';
import { formatCountdown } from '@rwm/shared';

/** Simulates network latency so skeletons show. Replace with real fetching once an API exists. */
export function useSimulatedLoad(key: string, ms = 600) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [key, ms]);
  return loading;
}

export function useCountdown(initialMs: number) {
  const [left, setLeft] = useState(initialMs);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setLeft(Math.max(0, initialMs - (Date.now() - start))), 1000);
    return () => clearInterval(id);
  }, [initialMs]);
  return { left, text: formatCountdown(left) };
}
