import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { formatCompactNaira, type AdminKpi } from '@rwm/shared';
import { Icon } from './Icon';

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="page-head row-between">
      <div>
        <h1 className="t-h1">{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

const TONE: Record<string, string> = {
  paid: 'badge-success', active: 'badge-success', live: 'badge-success', completed: 'badge-success',
  pending: 'badge-warning', draft: 'badge-warning', 'ending soon': 'badge-warning',
  failed: 'badge-danger', blocked: 'badge-danger',
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${TONE[status.toLowerCase()] ?? 'badge-info'}`}>{status}</span>;
}

export function CountUp({ value, format }: { value: number; format: AdminKpi['format'] }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => (format === 'naira-compact' ? formatCompactNaira(v) : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')));
  useEffect(() => {
    const c = animate(mv, value, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [mv, value]);
  return <motion.span>{text}</motion.span>;
}

export function KpiCard({ kpi, index }: { kpi: AdminKpi; index: number }) {
  return (
    <motion.div className="card card-pad kpi" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -3 }}>
      <span className="t-caption muted">{kpi.label}</span>
      <span className="kpi-value"><CountUp value={kpi.value} format={kpi.format} /></span>
      <span className={`t-caption kpi-delta is-${kpi.tone}`}>{kpi.delta}</span>
    </motion.div>
  );
}

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
}

export function DataTable<T extends { id: string }>({ rows, columns, searchText, filters, pageSize = 6, empty = 'Nothing matches your search.' }: {
  rows: T[];
  columns: Column<T>[];
  searchText: (row: T) => string;
  filters?: { label: string; value: (row: T) => string }[];
  pageSize?: number;
  empty?: string;
}) {
  const [q, setQ] = useState('');
  const [filterVals, setFilterVals] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);

  const options = useMemo(() => (filters ?? []).map((f) => ({ ...f, opts: [...new Set(rows.map(f.value))] })), [filters, rows]);

  const view = useMemo(() => {
    let r = rows.filter((x) => searchText(x).toLowerCase().includes(q.trim().toLowerCase()));
    for (const f of filters ?? []) {
      const v = filterVals[f.label];
      if (v) r = r.filter((x) => f.value(x) === v);
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      const sv = col?.sortValue;
      if (sv) r = [...r].sort((a, b) => (sv(a) > sv(b) ? 1 : sv(a) < sv(b) ? -1 : 0) * sort.dir);
    }
    return r;
  }, [rows, q, filterVals, sort, columns, filters, searchText]);

  const pages = Math.max(1, Math.ceil(view.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const slice = view.slice(cur * pageSize, cur * pageSize + pageSize);

  return (
    <div className="card table-card">
      <div className="table-tools">
        <div className="search-field">
          <Icon name="search" size={18} />
          <input className="input" placeholder="Search" aria-label="Search" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
        </div>
        {options.map((f) => (
          <select key={f.label} className="input select" aria-label={f.label} value={filterVals[f.label] ?? ''} onChange={(e) => { setFilterVals({ ...filterVals, [f.label]: e.target.value }); setPage(0); }}>
            <option value="">All {f.label.toLowerCase()}</option>
            {f.opts.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} aria-sort={sort?.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}>
                  {c.sortValue ? (
                    <button className="th-btn" onClick={() => setSort(sort?.key === c.key ? { key: c.key, dir: (sort.dir * -1) as 1 | -1 } : { key: c.key, dir: 1 })}>
                      {c.header}
                      <Icon name="chevronDown" size={14} style={{ transform: sort?.key === c.key && sort.dir === 1 ? 'rotate(180deg)' : undefined, opacity: sort?.key === c.key ? 1 : 0.35 }} />
                    </button>
                  ) : c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <motion.tr key={row.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.25 }}>
                {columns.map((c) => <td key={c.key}>{c.render(row)}</td>)}
              </motion.tr>
            ))}
          </tbody>
        </table>
        {slice.length === 0 && <div className="state"><p className="muted">{empty}</p></div>}
      </div>
      <div className="table-foot">
        <span className="t-caption muted">{view.length} result{view.length === 1 ? '' : 's'}</span>
        <div className="row-gap">
          <button className="btn btn-ghost btn-sm" disabled={cur === 0} onClick={() => setPage(cur - 1)}>Previous</button>
          <span className="t-caption">{cur + 1} / {pages}</span>
          <button className="btn btn-ghost btn-sm" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export function RevenueChart({ data }: { data: { label: string; valueM: number }[] }) {
  const w = 640, h = 220, pad = 28;
  const max = Math.max(...data.map((d) => d.valueM)) * 1.1;
  const pts = data.map((d, i) => [pad + (i * (w - pad * 2)) / (data.length - 1), h - pad - (d.valueM / max) * (h - pad * 2)] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1]![0]} ${h - pad} L${pts[0]![0]} ${h - pad} Z`;
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Monthly revenue in millions of naira">
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F4650D" stopOpacity="0.35" />
            <stop offset="1" stopColor="#F4650D" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((t) => <line key={t} x1={pad} x2={w - pad} y1={h - pad - t * (h - pad * 2)} y2={h - pad - t * (h - pad * 2)} style={{ stroke: 'var(--color-border)' }} strokeDasharray="3 5" />)}
        <motion.path d={area} fill="url(#rev)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
        <motion.path d={line} fill="none" stroke="#F4650D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
        {pts.map(([x, y], i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect x={x - 18} y={0} width={36} height={h} fill="transparent" />
            <motion.circle cx={x} cy={y} r={hover === i ? 6 : 3.5} style={{ fill: 'var(--color-bg)' }} stroke="#F4650D" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.07 }} />
            <text x={x} y={h - 8} textAnchor="middle" fontSize="11" style={{ fill: 'var(--color-text-3)' }}>{data[i]!.label}</text>
            {hover === i && <text x={x} y={y - 12} textAnchor="middle" fontSize="12" fontWeight="600" style={{ fill: 'var(--color-text)' }}>₦{data[i]!.valueM}M</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}
