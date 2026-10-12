import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface Admin { name: string; email: string }
interface AuthValue { admin: Admin | null; login: (email: string, password: string) => Promise<void>; logout: () => void }

const KEY = 'rwm:admin';
const Ctx = createContext<AuthValue | null>(null);

function read(): Admin | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Admin) : null;
  } catch {
    return null;
  }
}

/** Demo auth: any valid email + 6+ char password. Swap `login` for a real API call. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(read);
  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) throw new Error('Check your email and password (6+ characters).');
    const a = { name: email.split('@')[0] ?? 'Admin', email };
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* ignore */ }
    setAdmin(a);
  }, []);
  const logout = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    setAdmin(null);
  }, []);
  const value = useMemo(() => ({ admin, login, logout }), [admin, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth outside AuthProvider');
  return v;
}
