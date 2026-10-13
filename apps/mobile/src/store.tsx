import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PaymentMethod } from '@rwm/shared';
import { formatName, nameFromEmail } from './name';

export interface Session {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  photoUrl?: string;
  provider: 'email' | 'google';
}
export type ProfilePatch = Partial<Pick<Session, 'name' | 'email' | 'phone' | 'city'>>;
export interface NotificationPrefs { orders: boolean; auctions: boolean; priceDrops: boolean; promos: boolean }
export interface GoogleProfile { name: string; email: string; photoUrl?: string }

interface Persisted {
  favorites: string[];
  session: Session | null;
  onboarded: boolean;
  themeMode: 'system' | 'light' | 'dark';
  notifications: NotificationPrefs;
  defaultPayment: PaymentMethod;
}
interface Store extends Persisted {
  ready: boolean;
  toggleFavorite: (id: string) => void;
  signIn: (email: string) => void;
  /** Sign in with a Google profile. Creates the account on first use, so there is no separate sign-up step. */
  signInWithGoogle: (profile: GoogleProfile) => void;
  updateProfile: (patch: ProfilePatch) => void;
  setNotification: (key: keyof NotificationPrefs, value: boolean) => void;
  setDefaultPayment: (m: PaymentMethod) => void;
  signOut: () => void;
  finishOnboarding: () => void;
  setThemeMode: (m: 'system' | 'light' | 'dark') => void;
}

const KEY = 'rwm:state';
const empty: Persisted = {
  favorites: [],
  session: null,
  onboarded: false,
  themeMode: 'system',
  notifications: { orders: true, auctions: true, priceDrops: true, promos: false },
  defaultPayment: 'card',
};
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<Persisted> & { session?: Partial<Session> | null };
        setState({
          ...empty,
          ...saved,
          notifications: { ...empty.notifications, ...saved.notifications },
          // Sessions saved before Google sign-in existed have no provider field.
          session: saved.session ? ({ ...saved.session, name: formatName(saved.session.name ?? '') || nameFromEmail(saved.session.email ?? ''), provider: saved.session.provider ?? 'email' } as Session) : null,
        });
      })
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
    signIn: (email) => update((s) => ({ ...s, session: { email, name: nameFromEmail(email), provider: 'email' } })),
    signInWithGoogle: (p) => update((s) => {
      // Keep details the user already edited if the same Google account signs back in.
      const prev = s.session?.email.toLowerCase() === p.email.toLowerCase() ? s.session : null;
      return { ...s, session: { ...prev, name: prev?.name ?? (formatName(p.name) || nameFromEmail(p.email)), email: p.email, photoUrl: p.photoUrl ?? prev?.photoUrl, provider: 'google' } };
    }),
    updateProfile: (patch) => update((s) => (s.session ? { ...s, session: { ...s.session, ...patch, ...(patch.name !== undefined && { name: formatName(patch.name) || s.session.name }) } } : s)),
    setNotification: (key, v) => update((s) => ({ ...s, notifications: { ...s.notifications, [key]: v } })),
    setDefaultPayment: (m) => update((s) => ({ ...s, defaultPayment: m })),
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
