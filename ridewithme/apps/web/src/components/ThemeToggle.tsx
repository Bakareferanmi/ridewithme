'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon';

type Theme = 'light' | 'dark';

/** Follows the OS until the visitor picks a theme, then remembers the choice. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    setTheme(attr === 'light' || attr === 'dark' ? attr : window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { window.localStorage.setItem('rwm:theme', next); } catch { /* ignore */ }
    setTheme(next);
  };

  return (
    <button type="button" className="btn btn-secondary btn-icon btn-sm" onClick={toggle} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
    </button>
  );
}
