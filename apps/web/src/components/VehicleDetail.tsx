'use client';

import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import {
  formatCountdown,
  formatKm,
  formatNaira,
  makeBidSchema,
  vehicleName,
  vehicles,
  type AuctionInfo,
  type ListingMode,
  type Vehicle,
} from '@rwm/shared';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useCountdown } from '@/lib/hooks';
import { Icon } from './Icon';
import { AnimatedNumber, Reveal } from './motion';
import { useCompare, useFavorites, useToast } from './Providers';
import { VehiclePhoto } from './VehiclePhoto';
import { VehicleCard } from './VehicleCard';

const checks = ['Engine and transmission', 'Brakes and suspension', 'Electrical and lights', 'Body and paint', 'Interior and trim', 'Tyres and wheels'];
const modeTitle: Record<ListingMode, string> = { buy: 'Buy', rent: 'Rent', lease: 'Lease', auction: 'Bid' };

function Gallery({ vehicle }: { vehicle: Vehicle }) {
  const photos = vehicle.photos;
  const [index, setIndex] = useState(0);
  const name = vehicleName(vehicle);
  return (
    <div className="gallery">
      <div className="gallery-main">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ height: '100%' }}>
            <VehiclePhoto photo={photos[index]} alt={`${name}, photo ${index + 1}`} width={1200} size={96} priority />
          </motion.div>
        </AnimatePresence>
      </div>
      {photos.length > 1 ? (
        <div className="gallery-thumbs">
          {photos.map((p, i) => (
            <button key={p} type="button" className={`thumb ${i === index ? 'is-active' : ''}`} aria-pressed={i === index} aria-label={`Photo ${i + 1}`} onClick={() => setIndex(i)}>
              <VehiclePhoto photo={p} alt="" width={240} size={22} />
              {i === index ? <motion.span layoutId="thumb-ring" className="thumb-ring" transition={motionTokens.spring} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Inspection({ inspected }: { inspected: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card inspection">
      <button type="button" className="inspection-head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="inspection-icon" data-ok={inspected}>
          <Icon name="shield" size={24} color={inspected ? 'var(--color-success)' : 'var(--color-warning)'} />
        </span>
        <span className="inspection-text">
          <span className="t-label">Inspection report</span>
          <span className="muted t-caption">{inspected ? 'Passed. View the full checklist.' : 'Pending. We will publish the report soon.'}</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: 'flex' }}>
          <Icon name="chevronDown" size={20} color="var(--color-text-3)" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.ul
            className="inspection-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: motionTokens.ease }}
          >
            {checks.map((c, i) => (
              <motion.li key={c} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                <Icon name={inspected ? 'checkCircle' : 'clock'} size={18} color={inspected ? 'var(--color-success)' : 'var(--color-warning)'} />
                <span>{c}</span>
                <span className={`badge ${inspected ? 'badge-success' : 'badge-warning'}`}>{inspected ? 'Passed' : 'Pending'}</span>
              </motion.li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PurchasePanel({ vehicle, initialMode }: { vehicle: Vehicle; initialMode?: ListingMode }) {
  const modes = vehicle.modes;
  const [mode, setMode] = useState<ListingMode>(initialMode && modes.includes(initialMode) ? initialMode : modes[0] ?? 'buy');
  const [days, setDays] = useState(3);
  const [term, setTerm] = useState(vehicle.leaseTermMonths ?? 36);
  const [info, setInfo] = useState<AuctionInfo | undefined>(vehicle.auction);
  const [bid, setBid] = useState('');
  const [bidError, setBidError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const controls = useAnimationControls();
  const toast = useToast();
  const left = useCountdown(info?.endsInMs ?? 0);

  const shake = () => controls.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
  const minBid = info ? info.currentBid + info.minIncrement : 0;

  async function submitBid(e: FormEvent) {
    e.preventDefault();
    if (!info) return;
    const amount = Number(bid.replace(/[^\d]/g, ''));
    const parsed = makeBidSchema(minBid).safeParse({ amount });
    if (!parsed.success) {
      setBidError(parsed.error.issues[0]?.message ?? 'Enter a valid bid');
      void shake();
      return;
    }
    setBusy(true);
    setBidError(null);
    try {
      const next = await api.auctions.placeBid(vehicle.id, amount);
      setInfo(next);
      setBid('');
      toast.push("Bid placed. You're the highest bidder.", 'success');
    } catch (err) {
      setBidError(err instanceof Error ? err.message : 'Could not place your bid');
      void shake();
    } finally {
      setBusy(false);
    }
  }

  const checkoutHref = `/checkout?vehicle=${vehicle.id}&mode=${mode}&days=${days}&term=${term}`;

  return (
    <div className="panel card card-pad">
      <div className="segmented panel-tabs" role="tablist" aria-label="How do you want it?">
        {modes.map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} className={mode === m ? 'is-active' : ''} onClick={() => setMode(m)}>
            {mode === m ? <motion.span layoutId="panel-pill" className="pill" transition={motionTokens.spring} /> : null}
            {modeTitle[m]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={mode} className="panel-body" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {mode === 'buy' ? (
            <>
              <div>
                <span className="faint t-caption">Buy for</span>
                <p className="t-h1">
                  <AnimatedNumber value={vehicle.price} format={formatNaira} />
                </p>
              </div>
              <ul className="perks">
                <li><Icon name="shield" size={16} /> Inspection report included</li>
                <li><Icon name="route" size={16} /> Delivery or pickup, tracked</li>
                <li><Icon name="lock" size={16} /> Secure checkout</li>
              </ul>
            </>
          ) : null}

          {mode === 'rent' && vehicle.rentPerDay ? (
            <>
              <div>
                <span className="faint t-caption">Rent from</span>
                <p className="t-h2">
                  {formatNaira(vehicle.rentPerDay)}
                  <span className="suffix"> / day</span>
                </p>
              </div>
              <div className="stepper" role="group" aria-label="Rental days">
                <button type="button" className="btn btn-secondary btn-icon btn-sm" aria-label="Fewer days" onClick={() => setDays((d) => Math.max(1, d - 1))}>
                  <Icon name="minus" size={16} />
                </button>
                <span className="t-title">
                  {days} day{days > 1 ? 's' : ''}
                </span>
                <button type="button" className="btn btn-secondary btn-icon btn-sm" aria-label="More days" onClick={() => setDays((d) => Math.min(30, d + 1))}>
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <div className="total">
                <span className="muted t-label">Estimated total</span>
                <span className="t-h3">
                  <AnimatedNumber value={vehicle.rentPerDay * days} format={formatNaira} />
                </span>
              </div>
            </>
          ) : null}

          {mode === 'lease' && vehicle.leasePerMonth ? (
            <>
              <div>
                <span className="faint t-caption">Lease from</span>
                <p className="t-h2">
                  {formatNaira(vehicle.leasePerMonth)}
                  <span className="suffix"> / mo</span>
                </p>
              </div>
              <div className="chip-row" role="group" aria-label="Lease term">
                {[12, 24, 36].map((t) => (
                  <button key={t} type="button" aria-pressed={term === t} className={`chip ${term === t ? 'is-active' : ''}`} onClick={() => setTerm(t)}>
                    {t} months
                  </button>
                ))}
              </div>
              <div className="total">
                <span className="muted t-label">Contract value</span>
                <span className="t-h3">
                  <AnimatedNumber value={vehicle.leasePerMonth * term} format={formatNaira} />
                </span>
              </div>
            </>
          ) : null}

          {mode === 'auction' && info ? (
            <>
              <div className="row-between">
                <div>
                  <span className="faint t-caption">Current bid</span>
                  <p className="t-h2">
                    <AnimatedNumber value={info.currentBid} format={formatNaira} />
                  </p>
                </div>
                <div className="auction-meta">
                  <span className="badge badge-orange">
                    <span className="live-dot" /> {left === null ? '--' : formatCountdown(left)}
                  </span>
                  <span className="faint t-caption">{info.bidCount} bids</span>
                </div>
              </div>
              <form onSubmit={submitBid} noValidate className="bid-form">
                <motion.div animate={controls} className="field">
                  <label htmlFor="bid">Your bid</label>
                  <input
                    id="bid"
                    className="input"
                    inputMode="numeric"
                    placeholder={`Min ${formatNaira(minBid)}`}
                    value={bid}
                    aria-invalid={Boolean(bidError)}
                    onChange={(e) => {
                      setBid(e.target.value.replace(/[^\d]/g, ''));
                      setBidError(null);
                    }}
                  />
                  {bidError ? (
                    <span className="error-text" role="alert">
                      <Icon name="alert" size={14} /> {bidError}
                    </span>
                  ) : null}
                </motion.div>
                <div className="chip-row">
                  {[0, 1, 3].map((n) => (
                    <button key={n} type="button" className="chip" onClick={() => { setBid(String(minBid + n * info.minIncrement)); setBidError(null); }}>
                      {formatNaira(minBid + n * info.minIncrement)}
                    </button>
                  ))}
                </div>
                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
                  {busy ? <span className="spinner" /> : <Icon name="auction" size={18} />} Place bid
                </button>
              </form>
            </>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {mode !== 'auction' ? (
        <Link href={checkoutHref} className="btn btn-primary btn-lg btn-block">
          {mode === 'buy' ? 'Buy now' : mode === 'rent' ? 'Reserve this car' : 'Start lease'} <Icon name="arrowRight" size={18} strokeWidth={2.2} />
        </Link>
      ) : null}
    </div>
  );
}

export function VehicleDetail({ vehicle, initialMode }: { vehicle: Vehicle; initialMode?: ListingMode }) {
  const favorites = useFavorites();
  const compare = useCompare();
  const fav = favorites.has(vehicle.id);
  const name = vehicleName(vehicle);
  const related = vehicles.filter((v) => v.id !== vehicle.id).slice(0, 3);

  const specs = [
    { icon: 'gauge', label: 'Mileage', value: formatKm(vehicle.mileageKm) },
    { icon: 'gear', label: 'Transmission', value: vehicle.transmission },
    { icon: 'fuel', label: 'Fuel', value: vehicle.fuel },
    { icon: 'calendar', label: 'Year', value: String(vehicle.year) },
    { icon: 'car', label: 'Body', value: vehicle.body },
    { icon: 'pin', label: 'Location', value: vehicle.location },
  ] as const;

  return (
    <div className="container detail-page">
      <Link href="/vehicles" className="back t-label muted">
        <Icon name="arrowLeft" size={16} /> Back to marketplace
      </Link>

      <div className="detail">
        <div className="detail-main">
          <Gallery vehicle={vehicle} />

          <header className="detail-head">
            <div>
              <h1 className="t-h1">{name}</h1>
              <p className="muted">
                {vehicle.color} · {vehicle.location}
              </p>
            </div>
            <div className="detail-actions">
              <motion.button type="button" whileTap={{ scale: 0.85 }} className={`btn btn-secondary btn-icon ${fav ? 'is-fav' : ''}`} aria-pressed={fav} aria-label={fav ? 'Remove from favorites' : 'Save to favorites'} onClick={() => favorites.toggle(vehicle.id)}>
                <Icon name="heart" size={20} fill={fav ? 'var(--color-orange-500)' : 'none'} color={fav ? 'var(--color-orange-500)' : 'currentColor'} />
              </motion.button>
              <button type="button" className="btn btn-secondary" aria-pressed={compare.has(vehicle.id)} onClick={() => compare.toggle(vehicle.id)}>
                <Icon name="compare" size={18} /> {compare.has(vehicle.id) ? 'In compare' : 'Compare'}
              </button>
            </div>
          </header>

          <div className="specs">
            {specs.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05} y={14}>
                <div className="spec">
                  <Icon name={s.icon} size={20} color="var(--color-orange-400)" />
                  <span className="faint t-caption">{s.label}</span>
                  <span className="t-label">{s.value}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Inspection inspected={vehicle.inspected} />

          <section>
            <h2 className="t-title">About this vehicle</h2>
            <p className="muted detail-desc">{vehicle.description}</p>
            <div className="chip-row">
              {vehicle.features.map((f) => (
                <span key={f} className="chip" style={{ cursor: 'default' }}>
                  <Icon name="check" size={14} /> {f}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside className="detail-side">
          <PurchasePanel vehicle={vehicle} initialMode={initialMode} />
        </aside>
      </div>

      <section className="related">
        <h2 className="t-h3">You may also like</h2>
        <div className="grid">
          {related.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
