import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { initials } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import { Icon } from './Icon';
import { useAuth } from './auth';

const NAV: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Overview', icon: 'dashboard' },
  { to: '/vehicles', label: 'Vehicles', icon: 'car' },
  { to: '/sales', label: 'Sales & rentals', icon: 'tag' },
  { to: '/auctions', label: 'Auctions', icon: 'auction' },
  { to: '/customers', label: 'Customers', icon: 'users' },
  { to: '/payments', label: 'Payments', icon: 'payment' },
  { to: '/analytics', label: 'Analytics', icon: 'chart' },
  { to: '/content', label: 'Content', icon: 'bell' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

export function Layout() {
  const { admin, logout } = useAuth();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="side-brand"><img src="/logo.png" alt="" width={32} height={32} /><span>RideWithMe</span></div>
        <nav aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className="side-link" onClick={() => setOpen(false)}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="side-active" className="side-active" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span className="side-inner"><Icon name={n.icon} size={20} />{n.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="side-user">
          <span className="avatar">{initials(admin?.name ?? 'A')}</span>
          <div className="side-user-text"><span className="t-label">{admin?.name}</span><span className="t-caption muted">{admin?.email}</span></div>
          <button className="btn btn-ghost btn-icon" aria-label="Sign out" onClick={logout}><Icon name="logout" size={20} /></button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="topbar">
          <button className="btn btn-ghost btn-icon burger" aria-label="Open menu" onClick={() => setOpen(true)}><Icon name="menu" size={22} /></button>
          <span className="t-caption muted">Admin console</span>
        </header>
        <AnimatePresence mode="wait">
          <motion.main key={loc.pathname} className="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
