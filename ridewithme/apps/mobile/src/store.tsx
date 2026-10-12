import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface Persisted { favorites: string[]; session: { name: string; email: string } | null; onboarded: boolean; themeMode: 'system' | 'light' | 'dark' }
interface Store extends Persisted {
  ready: boolean;
  toggleFavorite: (id: string) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  finishOnboarding: () => void;
  setThemeMode: (m: 'system' | 'light' | 'dark') => void;
}

const KEY = 'rwm:state';
const empty: Persisted = { favorites: [], session: null, onboarded: false, themeMode: 'system' };
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setState({ ...empty, ...(JSON.parse(raw) as Persisted) }); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const update = useCallback((fn: (s: Persisted) => Persisted) => {
    setState((prev) => {
      const next = fn(prev);
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<Store>(() => ({
    ...state,
    ready,
    toggleFavorite: (id) => update((s) => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] })),
    signIn: (email) => update((s) => ({ ...s, session: { email, name: email.split('@')[0] ?? 'You' } })),
    signOut: () => update((s) => ({ ...s, session: null })),
    finishOnboarding: () => update((s) => ({ ...s, onboarded: true })),
    setThemeMode: (m) => update((s) => ({ ...s, themeMode: m })),
  }), [state, ready, update]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside StoreProvider');
  return v;
}
