'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll, type Variants } from 'framer-motion';
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

const links: { href: string; label: string; hint: string; icon: IconName }[] = [
  { href: '/vehicles', label: 'Marketplace', hint: 'Buy, rent or lease', icon: 'car' },
  { href: '/auctions', label: 'Auctions', hint: 'Bid live, win fair', icon: 'auction' },
  { href: '/#how', label: 'How it works', hint: 'From first look to the keys', icon: 'route' },
];

const MENU_ID = 'mobile-menu';

const sheet: Variants = {
  hidden: { opacity: 0, y: -12, transition: { duration: 0.18, ease: motionTokens.ease } },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: motionTokens.ease, staggerChildren: 0.06, delayChildren: 0.05 } },
};
const sheetItem: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: motionTokens.spring },
};

/** Three bars that morph into a cross. */
function Burger({ open }: { open: boolean }) {
  return (
    <span className="burger" aria-hidden="true">
      <motion.span className="burger-bar" initial={false} animate={open ? { y: 0, rotate: 45 } : { y: -6, rotate: 0 }} transition={motionTokens.spring} />
      <motion.span className="burger-bar" initial={false} animate={open ? { opacity: 0, scaleX: 0.2 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.18 }} />
      <motion.span className="burger-bar" initial={false} animate={open ? { y: 0, rotate: -45 } : { y: 6, rotate: 0 }} transition={motionTokens.spring} />
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const favorites = useFavorites();
  const { session } = useSession();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 12));

  // Close after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: Escape closes, the page behind does not scroll, and growing past the mobile breakpoint closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const mq = window.matchMedia('(min-width: 861px)');
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
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
          <button
            type="button"
            className={`btn btn-secondary btn-icon btn-sm nav-burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => setOpen((o) => !o)}
          >
            <Burger open={open} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              key="backdrop"
              className="nav-backdrop"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div key="sheet" id={MENU_ID} className="nav-sheet" variants={sheet} initial="hidden" animate="show" exit="hidden">
              <nav className="container nav-sheet-inner" aria-label="Menu">
                {links.map((l) => {
                  const active = l.href.startsWith('/#') ? false : pathname.startsWith(l.href);
                  return (
                    <motion.div key={l.href} variants={sheetItem}>
                      <Link href={l.href} className={`nav-sheet-link ${active ? 'is-active' : ''}`} onClick={() => setOpen(false)}>
                        <span className="nav-sheet-icon">
                          <Icon name={l.icon} size={20} />
                        </span>
                        <span className="nav-sheet-text">
                          <span className="nav-sheet-label">{l.label}</span>
                          <span className="nav-sheet-hint">{l.hint}</span>
                        </span>
                        <Icon name="chevronRight" size={18} className="nav-sheet-arrow" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
