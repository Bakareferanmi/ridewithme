'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { initials } from '@rwm/shared';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';
import { useFavorites, useSession } from './Providers';

const links = [
  { href: '/vehicles', label: 'Marketplace' },
  { href: '/auctions', label: 'Auctions' },
  { href: '/#how', label: 'How it works' },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const favorites = useFavorites();
  const { session } = useSession();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 12));

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="RideWithMe home">
          <Image src="/logo.png" alt="" width={36} height={36} priority />
          <span>RideWithMe</span>
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
          <button className="btn btn-secondary btn-icon btn-sm nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'close' : 'menu'} size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
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
                <motion.div key={l.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link href={l.href} className="nav-sheet-link" onClick={() => setOpen(false)}>
                    {l.label}
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
