'use client';

import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import type { Session } from '@rwm/shared';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

/* ---------- persisted state helper ---------- */
function usePersistent<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    try {
      if (value === null || value === undefined) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  }, [key, value, ready]);
  return [value, setValue, ready] as const;
}

/* ---------- toast ---------- */
type Tone = 'success' | 'error' | 'info';
interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}
const ToastContext = createContext<{ push: (message: string, tone?: Tone) => void } | null>(null);
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside Providers');
  return ctx;
};

function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((message: string, tone: Tone = 'info') => {
    const id = Date.now() + Math.random();
    setItems((list) => [...list.slice(-2), { id, message, tone }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 3600);
  }, []);
  const value = useMemo(() => ({ push }), [push]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              className="toast"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={motionTokens.spring}
            >
              <Icon
                name={t.tone === 'error' ? 'errorCircle' : t.tone === 'success' ? 'checkCircle' : 'info'}
                size={22}
                color={t.tone === 'error' ? 'var(--color-danger)' : t.tone === 'success' ? 'var(--color-success)' : 'var(--color-info)'}
              />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- session ---------- */
const SessionContext = createContext<{ session: Session | null; setSession: (s: Session | null) => void; ready: boolean } | null>(null);
export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside Providers');
  return ctx;
};

function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession, ready] = usePersistent<Session | null>('rwm:session', null);
  const value = useMemo(() => ({ session, setSession, ready }), [session, setSession, ready]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/* ---------- favorites ---------- */
const FavoritesContext = createContext<{ ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void } | null>(null);
export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside Providers');
  return ctx;
};

function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = usePersistent<string[]>('rwm:favorites', []);
  const toast = useToast();
  const value = useMemo(
    () => ({
      ids,
      has: (id: string) => ids.includes(id),
      toggle: (id: string) => {
        const adding = !ids.includes(id);
        setIds(adding ? [...ids, id] : ids.filter((x) => x !== id));
        toast.push(adding ? 'Saved to favorites' : 'Removed from favorites', adding ? 'success' : 'info');
      },
    }),
    [ids, setIds, toast],
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

/* ---------- compare (max 3) ---------- */
export const MAX_COMPARE = 3;
const CompareContext = createContext<{ ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void; clear: () => void } | null>(null);
export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside Providers');
  return ctx;
};

function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const toast = useToast();
  const value = useMemo(
    () => ({
      ids,
      has: (id: string) => ids.includes(id),
      toggle: (id: string) => {
        if (ids.includes(id)) return setIds(ids.filter((x) => x !== id));
        if (ids.length >= MAX_COMPARE) return toast.push(`You can compare up to ${MAX_COMPARE} vehicles`, 'info');
        setIds([...ids, id]);
      },
      clear: () => setIds([]),
    }),
    [ids, toast],
  );
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <SessionProvider>
          <FavoritesProvider>
            <CompareProvider>{children}</CompareProvider>
          </FavoritesProvider>
        </SessionProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
