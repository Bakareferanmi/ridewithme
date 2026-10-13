import { useEffect, useState } from 'react';

/** "Good morning" until noon, "Good afternoon" until 5pm, "Good evening" after. Uses the phone's local time. */
export function greetingFor(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Re-evaluates every minute so the greeting flips while the app stays open. */
export function useGreeting(): string {
  const [text, setText] = useState(() => greetingFor());
  useEffect(() => {
    const id = setInterval(() => setText(greetingFor()), 60_000);
    return () => clearInterval(id);
  }, []);
  return text;
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;
