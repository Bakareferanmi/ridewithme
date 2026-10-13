'use client';

import { motion, type Variants } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { vehicles } from '@rwm/shared';
import Link from 'next/link';
import { Icon } from './Icon';
import { VehiclePhoto } from './VehiclePhoto';

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: motionTokens.ease } },
};

const total = vehicles.length;
const auctions = vehicles.filter((v) => v.auction).length;
const inspected = Math.round((vehicles.filter((v) => v.inspected).length / total) * 100);

const stats = [
  { icon: 'car', label: 'Vehicles listed', value: String(total) },
  { icon: 'auction', label: 'Live auctions', value: String(auctions) },
  { icon: 'shield', label: 'Inspected', value: `${inspected}%` },
] as const;

export function Hero() {
  return (
    <section className="hero-full">
      <motion.div className="hero-bg" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: motionTokens.ease }}>
        <VehiclePhoto photo="1748392029242-19b20e799ec8" alt="" width={1920} priority />
      </motion.div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="container hero-grid">
        <motion.div className="hero-copy" variants={container} initial="hidden" animate="show">
          <motion.h1 variants={item} className="hero-title">
            Inspected.
            <br />
            Trusted.
            <br />
            <span className="accent">Yours.</span>
          </motion.h1>
          <motion.p variants={item} className="hero-sub">
            Every vehicle checked before it is listed.
            <br />
            Find it, compare it, drive it home.
          </motion.p>
          <motion.div variants={item} className="hero-cta">
            <Link href="/vehicles" className="btn-skew">
              <span>
                Browse vehicles <Icon name="arrowRight" size={18} strokeWidth={2.4} />
              </span>
            </Link>
            <Link href="/auctions" className="btn-skew btn-skew-ghost">
              <span>
                <span className="live-dot" /> Live auctions
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.aside className="hero-stats" aria-label="Marketplace at a glance" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: motionTokens.ease }}>
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <Icon name={s.icon} size={20} />
              <span className="hero-stat-label">{s.label}</span>
              <span className="hero-stat-value">{s.value}</span>
            </div>
          ))}
        </motion.aside>
      </div>
    </section>
  );
}
