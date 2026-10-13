'use client';

import { motion } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { bodyTypes, listingModes, type BodyType, type ListingMode, type VehicleQuery } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useAsync } from '@/lib/hooks';
import { Carousel } from './Carousel';
import { Icon } from './Icon';
import { EmptyState, ErrorState, VehicleCardSkeleton } from './StateViews';
import { VehicleCard } from './VehicleCard';

const isMode = (v: string | null): v is ListingMode => v === 'buy' || v === 'rent' || v === 'lease' || v === 'auction';
const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
const modeIcon: Record<ListingMode, IconName> = { buy: 'car', rent: 'key', lease: 'lease', auction: 'auction' };

export function VehicleExplorer() {
  const params = useSearchParams();
  const initialMode = params.get('mode');
  const [search, setSearch] = useState(params.get('q') ?? '');
  const [debounced, setDebounced] = useState(search);
  const [mode, setMode] = useState<ListingMode | 'all'>(isMode(initialMode) ? initialMode : 'all');
  const [body, setBody] = useState<BodyType[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const query = useMemo<VehicleQuery>(() => ({ search: debounced, body, sort: 'newest' }), [debounced, body]);
  const { data, loading, error, reload } = useAsync(() => api.vehicles.list(query), [query]);

  const sections = useMemo(
    () =>
      listingModes
        .filter((m) => mode === 'all' || m.id === mode)
        .map((m) => ({ ...m, items: (data ?? []).filter((v) => v.modes.includes(m.id)) }))
        .filter((s) => s.items.length > 0),
    [data, mode],
  );

  const reset = () => {
    setBody([]);
    setSearch('');
    setMode('all');
  };

  return (
    <div className="explorer2">
      <div className="toolbar">
        <div className="search-field">
          <Icon name="search" size={20} />
          <input className="input" type="search" placeholder="Search make, model or city" aria-label="Search vehicles" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="segmented" role="tablist" aria-label="Listing type">
          {[{ id: 'all' as const, label: 'All' }, ...listingModes].map((m) => (
            <button key={m.id} role="tab" aria-selected={mode === m.id} className={mode === m.id ? 'is-active' : ''} onClick={() => setMode(m.id)}>
              {mode === m.id ? <motion.span layoutId="mode-pill" className="pill" transition={motionTokens.spring} /> : null}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chip-row chip-scroll" aria-label="Body type">
        {bodyTypes.map((b) => (
          <button key={b} type="button" aria-pressed={body.includes(b)} className={`chip ${body.includes(b) ? 'is-active' : ''}`} onClick={() => setBody(toggle(body, b))}>
            {b}
          </button>
        ))}
      </div>

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading && !data ? (
        <div className="sec-skel">
          {Array.from({ length: 4 }).map((_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <EmptyState
          title="No vehicles match"
          body="Try fewer filters or a different search."
          action={
            <button className="btn btn-sm" onClick={reset}>
              Reset filters
            </button>
          }
        />
      ) : (
        <div className="sections" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity .2s' }}>
          {sections.map((s) => (
            <motion.section key={s.id} className="msec" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease: motionTokens.ease }}>
              <header className="msec-head">
                <span className="msec-icon">
                  <Icon name={modeIcon[s.id]} size={20} />
                </span>
                <div>
                  <h2 className="t-h3">{s.label}</h2>
                  <p className="faint t-label">{s.blurb}</p>
                </div>
                <span className="msec-count faint t-label">{s.items.length}</span>
                {s.id === 'auction' ? (
                  <Link href="/auctions" className="btn btn-ghost btn-sm">
                    Live room <Icon name="arrowRight" size={16} />
                  </Link>
                ) : null}
              </header>
              <Carousel label={`${s.label} vehicles`}>
                {s.items.map((v, i) => (
                  <div key={v.id} className="slide">
                    <VehicleCard vehicle={v} mode={s.id} index={i} />
                  </div>
                ))}
              </Carousel>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  );
}
