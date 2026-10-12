'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { fieldErrors, loginSchema, signupSchema } from '@rwm/shared';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { Icon } from './Icon';
import { useSession, useToast } from './Providers';

export function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const { setSession } = useSession();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [values, setValues] = useState({ name: '', phone: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const controls = useAnimationControls();

  const set = (key: keyof typeof values, v: string) => {
    setValues({ ...values, [key]: v });
    if (errors[key]) setErrors({ ...errors, [key]: '' });
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = mode === 'login' ? loginSchema.safeParse(values) : signupSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      void controls.start({ x: [0, -10, 10, -8, 8, 0], transition: { duration: 0.4 } });
      return;
    }
    setBusy(true);
    try {
      const session = mode === 'login' ? await api.auth.login(loginSchema.parse(values)) : await api.auth.signup(signupSchema.parse(values));
      setSession(session);
      toast.push(`Welcome, ${session.user.name.split(' ')[0]}`, 'success');
      router.push('/account');
    } catch (err) {
      toast.push(err instanceof Error ? err.message : 'Something went wrong', 'error');
    } finally {
      setBusy(false);
    }
  }

  const input = (key: keyof typeof values, label: string, props: { type?: string; autoComplete?: string; placeholder?: string } = {}) => (
    <div className="field">
      <label htmlFor={key}>{label}</label>
      <input id={key} className="input" value={values[key]} aria-invalid={Boolean(errors[key])} onChange={(e) => set(key, e.target.value)} {...props} />
      {errors[key] ? (
        <span className="error-text" role="alert">
          <Icon name="alert" size={14} /> {errors[key]}
        </span>
      ) : null}
    </div>
  );

  return (
    <div className="auth container">
      <motion.div className="card card-pad auth-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: motionTokens.ease }}>
        <div className="auth-brand">
          <Image src="/logo.png" alt="" width={56} height={56} />
          <h1 className="t-h2">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="muted">Buy, rent, lease and bid in one place.</p>
        </div>

        <div className="segmented" role="tablist" aria-label="Sign in or sign up" style={{ width: '100%' }}>
          {(['login', 'signup'] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} className={mode === m ? 'is-active' : ''} onClick={() => { setMode(m); setErrors({}); }}>
              {mode === m ? <motion.span layoutId="auth-pill" className="pill" transition={motionTokens.spring} /> : null}
              {m === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <motion.form animate={controls} onSubmit={submit} noValidate className="stack">
          {mode === 'signup' ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="stack" style={{ overflow: 'hidden' }}>
              {input('name', 'Full name', { autoComplete: 'name' })}
              {input('phone', 'Phone number', { autoComplete: 'tel', placeholder: '0801 234 5678' })}
            </motion.div>
          ) : null}
          {input('email', 'Email', { type: 'email', autoComplete: 'email' })}
          {input('password', 'Password', { type: 'password', autoComplete: mode === 'login' ? 'current-password' : 'new-password' })}
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
            {busy ? <span className="spinner" /> : null} {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}
