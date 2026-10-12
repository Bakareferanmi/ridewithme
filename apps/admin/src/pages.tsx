import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { adminKpis, customers, formatCompactNaira, formatNaira, initials, payments, revenueSeries, transactions, vehicleName, vehicles, modeLabel } from '@rwm/shared';
import { Icon } from './Icon';
import { useAuth } from './auth';
import { DataTable, KpiCard, PageHead, RevenueChart, StatusBadge } from './ui';

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setShake((s) => s + 1);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth">
      <motion.form key={shake} className="card card-pad auth-card" onSubmit={submit} noValidate initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0, x: shake ? [0, -8, 8, -5, 5, 0] : 0 }} transition={{ duration: 0.45 }}>
        <div className="auth-brand"><img src="/logo.png" alt="" width={56} height={56} /><h1 className="t-h2">Admin sign in</h1><p className="muted">Manage vehicles, orders and payments.</p></div>
        <div className="field"><label htmlFor="email" className="t-label">Email</label><input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label htmlFor="pw" className="t-label">Password</label><input id="pw" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {error && <p className="error-text" role="alert">{error}</p>}
        <button className="btn btn-primary btn-lg btn-block" disabled={busy}>{busy ? <span className="spinner" aria-label="Signing in" /> : 'Sign in'}</button>
        <p className="t-caption muted">Demo: any email and a 6+ character password.</p>
      </motion.form>
    </div>
  );
}

export function Overview() {
  return (
    <>
      <PageHead title="Overview" sub="How the marketplace is doing today." />
      <div className="kpis">{adminKpis.map((k, i) => <KpiCard key={k.id} kpi={k} index={i} />)}</div>
      <div className="two-col">
        <section className="card card-pad"><h2 className="t-title">Revenue</h2><p className="t-caption muted">Last {revenueSeries.length} months, ₦ millions</p><RevenueChart data={revenueSeries} /></section>
        <section className="card card-pad">
          <h2 className="t-title">Recent activity</h2>
          <ul className="feed">
            {transactions.slice(0, 5).map((t, i) => (
              <motion.li key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
                <span className="avatar">{initials(t.customer)}</span>
                <span className="feed-text"><span className="t-label">{t.vehicle}</span><span className="t-caption muted">{t.type} · {t.customer}</span></span>
                <StatusBadge status={t.status} />
              </motion.li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export function Vehicles() {
  return (
    <>
      <PageHead title="Vehicles" sub="Every listing across buy, rent, lease and auction." action={<button className="btn btn-primary"><Icon name="plus" size={18} />Add vehicle</button>} />
      <DataTable
        rows={vehicles}
        searchText={(v) => `${vehicleName(v)} ${v.location}`}
        filters={[{ label: 'Body', value: (v) => v.body }]}
        columns={[
          { key: 'name', header: 'Vehicle', render: (v) => <span className="t-label">{vehicleName(v)}</span>, sortValue: (v) => vehicleName(v) },
          { key: 'modes', header: 'Listed for', render: (v) => v.modes.map(modeLabel).join(', ') },
          { key: 'loc', header: 'Location', render: (v) => v.location },
          { key: 'price', header: 'Price', render: (v) => formatNaira(v.price), sortValue: (v) => v.price },
          { key: 'ins', header: 'Inspection', render: (v) => <StatusBadge status={v.inspected ? 'Active' : 'Pending'} /> },
        ]}
      />
    </>
  );
}

export function Sales() {
  return (
    <>
      <PageHead title="Sales & rentals" sub="Orders, leases and rentals." />
      <DataTable
        rows={transactions}
        searchText={(t) => `${t.vehicle} ${t.customer}`}
        filters={[{ label: 'Type', value: (t) => t.type }, { label: 'Status', value: (t) => t.status }]}
        columns={[
          { key: 'v', header: 'Vehicle', render: (t) => <span className="t-label">{t.vehicle}</span>, sortValue: (t) => t.vehicle },
          { key: 't', header: 'Type', render: (t) => t.type },
          { key: 'c', header: 'Customer', render: (t) => t.customer },
          { key: 'a', header: 'Amount', render: (t) => t.amountLabel, sortValue: (t) => t.amount },
          { key: 's', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
          { key: 'd', header: 'Date', render: (t) => t.date, sortValue: (t) => t.date },
        ]}
      />
    </>
  );
}

export function Auctions() {
  const live = vehicles.filter((v) => v.auction);
  return (
    <>
      <PageHead title="Auctions" sub={`${live.length} live auctions.`} />
      <DataTable
        rows={live}
        searchText={(v) => vehicleName(v)}
        columns={[
          { key: 'v', header: 'Vehicle', render: (v) => <span className="t-label">{vehicleName(v)}</span> },
          { key: 'b', header: 'Current bid', render: (v) => formatNaira(v.auction!.currentBid), sortValue: (v) => v.auction!.currentBid },
          { key: 'n', header: 'Bids', render: (v) => v.auction!.bidCount, sortValue: (v) => v.auction!.bidCount },
          { key: 'e', header: 'Ends in', render: (v) => `${Math.round(v.auction!.endsInMs / 3_600_000)}h`, sortValue: (v) => v.auction!.endsInMs },
          { key: 's', header: 'Status', render: (v) => <StatusBadge status={v.auction!.endsInMs < 6 * 3_600_000 ? 'Ending soon' : 'Live'} /> },
        ]}
      />
    </>
  );
}

export function Customers() {
  return (
    <>
      <PageHead title="Customers" sub="Everyone who signed up." />
      <DataTable
        rows={customers}
        searchText={(c) => `${c.name} ${c.email} ${c.city}`}
        filters={[{ label: 'Status', value: (c) => c.status }]}
        columns={[
          { key: 'n', header: 'Name', render: (c) => <span className="cell-user"><span className="avatar">{initials(c.name)}</span><span><span className="t-label">{c.name}</span><br /><span className="t-caption muted">{c.email}</span></span></span>, sortValue: (c) => c.name },
          { key: 'c', header: 'City', render: (c) => c.city },
          { key: 'o', header: 'Orders', render: (c) => c.orders, sortValue: (c) => c.orders },
          { key: 'j', header: 'Joined', render: (c) => c.joinedAt, sortValue: (c) => c.joinedAt },
          { key: 's', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
        ]}
      />
    </>
  );
}

export function Payments() {
  return (
    <>
      <PageHead title="Payments" sub="Transfers, cards and wallet payments." />
      <DataTable
        rows={payments}
        searchText={(p) => `${p.reference} ${p.customer}`}
        filters={[{ label: 'Method', value: (p) => p.method }, { label: 'Status', value: (p) => p.status }]}
        columns={[
          { key: 'r', header: 'Reference', render: (p) => <span className="t-label">{p.reference}</span> },
          { key: 'c', header: 'Customer', render: (p) => p.customer },
          { key: 'm', header: 'Method', render: (p) => p.method },
          { key: 'a', header: 'Amount', render: (p) => formatNaira(p.amount), sortValue: (p) => p.amount },
          { key: 's', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
          { key: 'd', header: 'Date', render: (p) => p.date, sortValue: (p) => p.date },
        ]}
      />
    </>
  );
}

export function Analytics() {
  const total = revenueSeries.reduce((s, r) => s + r.valueM, 0);
  const byType = ['Sale', 'Lease', 'Rental', 'Auction'].map((t) => ({ t, n: transactions.filter((x) => x.type === t).length }));
  const max = Math.max(...byType.map((b) => b.n), 1);
  return (
    <>
      <PageHead title="Analytics" sub="Revenue and mix." />
      <div className="two-col">
        <section className="card card-pad"><h2 className="t-title">Revenue trend</h2><p className="t-caption muted">Total {formatCompactNaira(total * 1_000_000)}</p><RevenueChart data={revenueSeries} /></section>
        <section className="card card-pad">
          <h2 className="t-title">Orders by type</h2>
          <div className="bars">
            {byType.map((b, i) => (
              <div key={b.t} className="bar-row">
                <span className="t-label">{b.t}</span>
                <div className="bar-track"><motion.div className="bar-fill" initial={{ width: 0 }} animate={{ width: `${(b.n / max) * 100}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} /></div>
                <span className="t-caption muted">{b.n}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export function Content() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHead title="Content & notifications" sub="Send a push or email announcement." />
      <form className="card card-pad stack" onSubmit={(e) => { e.preventDefault(); if (title && body) { setSent(true); setTitle(''); setBody(''); setTimeout(() => setSent(false), 2500); } }}>
        <div className="field"><label htmlFor="t" className="t-label">Title</label><input id="t" className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="field"><label htmlFor="b" className="t-label">Message</label><textarea id="b" className="input" rows={4} value={body} onChange={(e) => setBody(e.target.value)} /></div>
        <div className="row-gap"><button className="btn btn-primary" disabled={!title || !body}>Send to all customers</button>{sent && <motion.span className="badge badge-success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>Queued</motion.span>}</div>
      </form>
    </>
  );
}

export function Settings() {
  const [prefs, setPrefs] = useState({ auctions: true, payments: true, signups: false });
  return (
    <>
      <PageHead title="Settings" sub="Notification preferences." />
      <div className="card card-pad stack">
        {(Object.keys(prefs) as (keyof typeof prefs)[]).map((k) => (
          <label key={k} className="switch-row">
            <span className="t-label">Notify me about {k}</span>
            <input type="checkbox" className="switch" checked={prefs[k]} onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })} />
          </label>
        ))}
      </div>
    </>
  );
}
