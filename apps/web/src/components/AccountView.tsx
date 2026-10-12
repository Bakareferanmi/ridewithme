'use client';

import { motion } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { findVehicle, formatNaira, initials, modeLabel, orderSteps, type Order, type Vehicle } from '@rwm/shared';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useAsync } from '@/lib/hooks';
import { Icon } from './Icon';
import { useFavorites, useSession } from './Providers';
import { EmptyState, ErrorState } from './StateViews';
import { VehicleCard } from './VehicleCard';

function OrderCard({ order, index }: { order: Order; index: number }) {
  const current = orderSteps.findIndex((s) => s.id === order.status);
  const pct = (current / (orderSteps.length - 1)) * 100;
  return (
    <motion.article className="card card-pad order" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.45, ease: motionTokens.ease }}>
      <div className="row-between">
        <div>
          <h3 className="t-title">{order.vehicleName}</h3>
          <p className="muted t-label">
            {order.id} · {modeLabel(order.mode)} · {formatNaira(order.amount)}
          </p>
        </div>
        <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-orange'}`}>{orderSteps[current]?.label}</span>
      </div>
      <div className="timeline" role="list" aria-label="Order progress">
        <div className="timeline-track">
          <motion.div className="timeline-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.2 + index * 0.08, ease: motionTokens.ease }} />
        </div>
        {orderSteps.map((s, i) => (
          <div key={s.id} role="listitem" className={`timeline-step ${i <= current ? 'is-done' : ''}`}>
            <span className="dot">{i <= current ? <Icon name="check" size={12} strokeWidth={3} /> : null}</span>
            <span className="t-caption">{s.label}</span>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

export function AccountView() {
  const { session, setSession, ready } = useSession();
  const favorites = useFavorites();
  const [tab, setTab] = useState<'orders' | 'saved'>('orders');
  const orders = useAsync(() => api.orders.list(), []);
  const saved = favorites.ids.map(findVehicle).filter((v): v is Vehicle => Boolean(v));

  if (!ready) return <div className="container page" />;

  return (
    <div className="container page account">
      <div className="account-head">
        <div className="avatar avatar-lg">{session ? initials(session.user.name) : <Icon name="user" size={26} />}</div>
        <div>
          <h1 className="t-h2">{session ? session.user.name : 'Guest'}</h1>
          <p className="muted">{session ? session.user.email : 'Sign in to sync your orders and bids.'}</p>
        </div>
        {session ? (
          <button className="btn btn-secondary btn-sm" onClick={() => setSession(null)}>
            <Icon name="logout" size={16} /> Sign out
          </button>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm">Sign in</Link>
        )}
      </div>

      <div className="tabs" role="tablist">
        {(['orders', 'saved'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-active' : ''} onClick={() => setTab(t)}>
            {t === 'orders' ? 'Orders and tracking' : `Saved (${saved.length})`}
            {tab === t ? <motion.span layoutId="tab-underline" className="tab-underline" transition={motionTokens.spring} /> : null}
          </button>
        ))}
      </div>

      {tab === 'orders' ? (
        orders.error ? (
          <ErrorState onRetry={orders.reload} />
        ) : orders.loading ? (
          <div className="stack">
            <div className="skeleton" style={{ height: 150 }} />
            <div className="skeleton" style={{ height: 150 }} />
          </div>
        ) : orders.data && orders.data.length > 0 ? (
          <div className="stack">
            {orders.data.map((o, i) => (
              <OrderCard key={o.id} order={o} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState icon="package" title="No orders yet" action={<Link href="/vehicles" className="btn btn-primary btn-sm">Browse vehicles</Link>} />
        )
      ) : saved.length > 0 ? (
        <div className="grid">
          {saved.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState icon="heart" title="No favorites yet" body="Tap the heart on any vehicle to save it here." action={<Link href="/vehicles" className="btn btn-primary btn-sm">Find a vehicle</Link>} />
      )}
    </div>
  );
}
