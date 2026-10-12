'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { bodyTypes, fuelTypes, formatCompactNaira, listingModes, type BodyType, type FuelType, type ListingMode, type SortKey, type VehicleQuery } from '@rwm/shared';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useAsync } from '@/lib/hooks';
import { Icon } from './Icon';
import { EmptyState, ErrorState, VehicleCardSkeleton } from './StateViews';
import { VehicleCard } from './VehicleCard';

const MAX_PRICE = 110_000_000;
const sorts: { id: SortKey; label: string }[] = [
  { id: 'newest', label: 'Newest first' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'mileage', label: 'Lowest mileage' },
];

const isMode = (v: string | null): v is ListingMode => v === 'buy' || v === 'rent' || v === 'lease' || v === 'auction';
const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

export function VehicleExplorer() {
  const params = useSearchParams();
  const initialMode = params.get('mode');
  const [search, setSearch] = useState(params.get('q') ?? '');
  const [debounced, setDebounced] = useState(search);
  const [mode, setMode] = useState<ListingMode | 'all'>(isMode(initialMode) ? initialMode : 'all');
  const [body, setBody] = useState<BodyType[]>([]);
  const [fuel, setFuel] = useState<FuelType[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<SortKey>('newest');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const query = useMemo<VehicleQuery>(
    () => ({
      search: debounced,
      mode: mode === 'all' ? undefined : mode,
      body,
      fuel,
      maxPrice: maxPrice >= MAX_PRICE ? undefined : maxPrice,
      sort,
    }),
    [debounced, mode, body, fuel, maxPrice, sort],
  );
  const { data, loading, error, reload } = useAsync(() => api.vehicles.list(query), [query]);
  const activeFilters = body.length + fuel.length + (maxPrice < MAX_PRICE ? 1 : 0);

  const reset = () => {
    setBody([]);
    setFuel([]);
    setMaxPrice(MAX_PRICE);
    setSearch('');
    setMode('all');
  };

  return (
    <div className="explorer">
      <aside className="filters card card-pad" aria-label="Filters">
        <div className="filters-head">
          <h2 className="t-title">Filters</h2>
          <AnimatePresence>
            {activeFilters > 0 ? (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="btn btn-ghost btn-sm" onClick={reset}>
                Clear all
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <fieldset className="filter-group">
          <legend className="label">Body type</legend>
          <div className="chip-row">
            {bodyTypes.map((b) => (
              <button key={b} type="button" aria-pressed={body.includes(b)} className={`chip ${body.includes(b) ? 'is-active' : ''}`} onClick={() => setBody(toggle(body, b))}>
                {b}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="label">Max price</legend>
          <input type="range" min={5_000_000} max={MAX_PRICE} step={500_000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} aria-label="Maximum price" />
          <div className="row-between faint t-caption">
            <span>₦5M</span>
            <span className="t-label" style={{ color: 'var(--color-text)' }}>
              {maxPrice >= MAX_PRICE ? 'Any price' : `Up to ${formatCompactNaira(maxPrice)}`}
            </span>
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="label">Fuel type</legend>
          {fuelTypes.map((f) => (
            <label key={f} className="check">
              <input type="checkbox" checked={fuel.includes(f)} onChange={() => setFuel(toggle(fuel, f))} />
              <span className="box">{fuel.includes(f) ? <Icon name="check" size={14} strokeWidth={3} /> : null}</span>
              {f}
            </label>
          ))}
        </fieldset>
      </aside>

      <section className="results" aria-label="Results">
        <div className="toolbar">
          <div className="search-field">
            <Icon name="search" size={20} />
            <input className="input" type="search" placeholder="Search make, model or city" aria-label="Search vehicles" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input input-sm sort" aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="segmented" role="tablist" aria-label="Listing type">
          {[{ id: 'all' as const, label: 'All' }, ...listingModes].map((m) => (
            <button key={m.id} role="tab" aria-selected={mode === m.id} className={mode === m.id ? 'is-active' : ''} onClick={() => setMode(m.id)}>
              {mode === m.id ? <motion.span layoutId="mode-pill" className="pill" transition={motionTokens.spring} /> : null}
              {m.label}
            </button>
          ))}
        </div>

        <p className="faint t-label" aria-live="polite">
          {loading ? 'Searching…' : error ? '' : `${data?.length ?? 0} vehicle${data?.length === 1 ? '' : 's'}`}
        </p>

        {error ? (
          <ErrorState onRetry={reload} />
        ) : loading && !data ? (
          <div className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : data && data.length === 0 ? (
          <EmptyState
            title="No vehicles match"
            body="Try a wider price range or fewer filters."
            action={
              <button className="btn btn-sm" onClick={reset}>
                Reset filters
              </button>
            }
          />
        ) : (
          <motion.div layout className="grid" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity .2s' }}>
            <AnimatePresence mode="popLayout">
              {data?.map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} mode={mode === 'all' ? undefined : mode} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}
