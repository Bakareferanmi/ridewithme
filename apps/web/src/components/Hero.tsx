'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { listingModes, type ListingMode } from '@rwm/shared';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type PointerEvent } from 'react';
import { Icon } from './Icon';
import { VehiclePhoto } from './VehiclePhoto';

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: motionTokens.ease } },
};

export function Hero() {
  const router = useRouter();
  const [mode, setMode] = useState<ListingMode>('buy');
  const [query, setQuery] = useState('');

  // Soft orange glow that follows the pointer.
  const px = useMotionValue(0.6);
  const py = useMotionValue(0.4);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(244,101,13,0.3), transparent 62%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/vehicles?mode=${mode}${query.trim() ? `&q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <section className="hero container">
      <motion.div className="hero-copy" variants={container} initial="hidden" animate="show">
        <motion.h1 variants={item} className="t-display">
          Drive what
          <br />
          <span className="accent">moves you</span>
        </motion.h1>
        <motion.p variants={item} className="t-body-l muted hero-sub">
          Every vehicle is inspected before it is listed. Find it, compare it and take it home in one place.
        </motion.p>

        <motion.form variants={item} className="hero-search card" onSubmit={submit} role="search">
          <div className="segmented" role="tablist" aria-label="Listing type">
            {listingModes.map((m) => (
              <button type="button" key={m.id} role="tab" aria-selected={mode === m.id} className={mode === m.id ? 'is-active' : ''} onClick={() => setMode(m.id)}>
                {mode === m.id ? <motion.span layoutId="hero-pill" className="pill" transition={motionTokens.spring} /> : null}
                {m.label}
              </button>
            ))}
          </div>
          <div className="hero-search-row">
            <div className="search-field">
              <Icon name="search" size={20} />
              <input className="input" placeholder="Search make, model or city" aria-label="Search vehicles" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              Search <Icon name="arrowRight" size={18} strokeWidth={2.2} />
            </button>
          </div>
        </motion.form>
      </motion.div>

      <motion.div
        className="hero-visual"
        onPointerMove={onMove}
        style={{ background: glow }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: motionTokens.ease }}
      >
        <motion.div className="hero-photo" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: motionTokens.ease }}>
          <VehiclePhoto photo="1748392029242-19b20e799ec8" alt="A Lexus SUV parked on a dirt road at sunset" width={1200} priority />
        </motion.div>
        <motion.div className="float-chip chip-a" animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <Icon name="shield" size={16} color="var(--color-success)" /> Inspected
        </motion.div>
        <motion.div className="float-chip chip-b" animate={{ y: [0, 8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}>
          <span className="live-dot" /> Live auctions
        </motion.div>
      </motion.div>
    </section>
  );
}
