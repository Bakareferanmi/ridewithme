import { useCallback, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useStore } from './store';

// Lets the auth popup close itself and hand control back to the app after Google redirects.
WebBrowser.maybeCompleteAuthSession();

const WEB = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const ANDROID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const IOS = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

/** True once at least one Google OAuth client ID is set in the environment. */
export const googleConfigured = !!(WEB || ANDROID || IOS);

// expo-auth-session throws if a platform's client ID is undefined, even when we never start the flow.
const PLACEHOLDER = 'not-configured';

interface GoogleUserInfo { name?: string; given_name?: string; email?: string; picture?: string }

/**
 * Google sign in and sign up in one. Google tells us who the person is; the store
 * creates the account the first time that email signs in.
 */
export function useGoogleSignIn(onDone?: () => void) {
  const { signInWithGoogle } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, response, prompt] = Google.useAuthRequest({
    webClientId: WEB ?? PLACEHOLDER,
    androidClientId: ANDROID ?? PLACEHOLDER,
    iosClientId: IOS ?? PLACEHOLDER,
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      const token = response.authentication?.accessToken;
      if (!token) { setBusy(false); setError('Google did not return a sign-in token. Try again.'); return; }
      fetch('https://www.googleapis.com/userinfo/v2/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<GoogleUserInfo>; })
        .then((u) => {
          if (!u.email) throw new Error('no email');
          signInWithGoogle({ name: u.name ?? u.given_name ?? u.email.split('@')[0] ?? 'You', email: u.email, photoUrl: u.picture });
          onDone?.();
        })
        .catch(() => setError('Could not read your Google profile. Check your connection and try again.'))
        .finally(() => setBusy(false));
    } else {
      setBusy(false);
      if (response.type === 'error') setError('Google sign in failed. Try again.');
    }
    // onDone is intentionally excluded: it is a fresh closure each render and the effect should only react to the response.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, signInWithGoogle]);

  const start = useCallback(async () => {
    setError(null);
    if (!googleConfigured) {
      setError('Google sign in is not set up yet. Add the EXPO_PUBLIC_GOOGLE_*_CLIENT_ID values (see README) and rebuild the app.');
      return;
    }
    if (!request) return;
    setBusy(true);
    try { await prompt(); } catch { setBusy(false); setError('Could not open Google sign in.'); }
  }, [request, prompt]);

  return { start, busy, error, ready: !!request };
}
