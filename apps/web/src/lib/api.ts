import { createApiClient } from '@rwm/shared';

/**
 * Set NEXT_PUBLIC_API_URL to talk to a real backend. Without it the app runs on
 * the sample data from @rwm/shared, so every screen works out of the box.
 */
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  getToken: () => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem('rwm:session');
      return raw ? (JSON.parse(raw) as { token?: string }).token ?? null : null;
    } catch {
      return null;
    }
  },
});
