'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { initials } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';
import { useFavorites, useSession } from './Providers';

const links: { href: string; label: string; icon: IconName }[] = [
  { href: '/vehicles', label: 'Marketplace', icon: 'car' },
  { href: '/auctions', label: 'Auctions', icon: 'auction' },
  { href: '/#how', label: 'How it works', icon: 'route' },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const favorites = useFavorites();
  const { session } = useSession();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 12));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="RideWithMe home">
          <Image src="/logo.png" alt="" width={36} height={36} priority />
        </Link>

        <nav className="nav-links" aria-label="Main">
          {links.map((l) => {
            const active = l.href.startsWith('/#') ? false : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`nav-link ${active ? 'is-active' : ''}`}>
                {active ? <motion.span layoutId="nav-pill" className="nav-pill" transition={motionTokens.spring} /> : null}
                <span className="nav-link-label">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/account" className="btn btn-secondary btn-icon btn-sm nav-fav" aria-label={`Saved vehicles, ${favorites.ids.length}`}>
            <Icon name="heart" size={18} />
            <AnimatePresence>
              {favorites.ids.length > 0 ? (
                <motion.span
                  key={favorites.ids.length}
                  className="nav-count"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={motionTokens.spring}
                >
                  {favorites.ids.length}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </Link>
          {session ? (
            <Link href="/account" className="avatar" aria-label="Your account">
              {initials(session.user.name)}
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Sign in
            </Link>
          )}
          <button className={`btn btn-secondary btn-icon btn-sm nav-burger ${open ? 'is-open' : ''}`} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span className="burger" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div className="nav-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
        ) : null}
        {open ? (
          <motion.div
            className="nav-sheet"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: motionTokens.ease }}
          >
            <div className="container nav-sheet-inner">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.07 * i + 0.08, ease: motionTokens.ease }}>
                  <Link href={l.href} className="nav-sheet-link" onClick={() => setOpen(false)}>
                    <span className="nav-sheet-ico">
                      <span>
                        <Icon name={l.icon} size={18} />
                      </span>
                      {l.label}
                    </span>
                    <Icon name="chevronRight" size={18} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
