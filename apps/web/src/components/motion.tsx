'use client';

import { animate, motion, useMotionValue } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { formatCountdown } from '@rwm/shared';
import { useEffect, useState, type ReactNode } from 'react';
import { useCountdown } from '@/lib/hooks';

/** Fades and lifts content in once it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: motionTokens.ease }}
    >
      {children}
    </motion.div>
  );
}

/** Tweens between numeric values, e.g. a price that changes when you switch mode. */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const [text, setText] = useState(() => format(value));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: motionTokens.ease });
    const unsubscribe = mv.on('change', (v) => setText(format(Math.round(v))));
    return () => {
      controls.stop();
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span>{text}</span>;
}

export function Countdown({ endsInMs }: { endsInMs: number }) {
  const left = useCountdown(endsInMs);
  return <span suppressHydrationWarning>{left === null ? '--' : formatCountdown(left)}</span>;
}

/** Draws a check mark. Used on success states. */
export function AnimatedCheck({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <motion.circle
        cx="36"
        cy="36"
        r="32"
        stroke="var(--color-success)"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: motionTokens.ease }}
      />
      <motion.path
        d="M22 37l10 10 18-21"
        stroke="var(--color-success)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.45, ease: motionTokens.ease }}
      />
    </svg>
  );
}
