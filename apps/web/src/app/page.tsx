import { listingModes, vehicles } from '@rwm/shared';
import type { IconName } from '@rwm/icons';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Carousel } from '@/components/Carousel';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/motion';
import { VehicleCard } from '@/components/VehicleCard';

const modeIcons: Record<string, IconName> = { buy: 'car', rent: 'key', lease: 'lease', auction: 'auction' };

const steps: { icon: IconName; title: string; body: string }[] = [
  { icon: 'search', title: 'Discover', body: 'Browse inspected vehicles near you.' },
  { icon: 'filter', title: 'Search', body: 'Filter by price, body type and fuel.' },
  { icon: 'eye', title: 'View', body: 'Photos, specs and the inspection report.' },
  { icon: 'compare', title: 'Compare', body: 'Put up to three vehicles side by side.' },
  { icon: 'key', title: 'Choose', body: 'Buy, rent, lease or place a bid.' },
  { icon: 'payment', title: 'Checkout', body: 'Pay securely in a few taps.' },
  { icon: 'route', title: 'Track', body: 'Follow your order to the door.' },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="container section">
        <div className="paths">
          {listingModes.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.06} y={20}>
              <Link href={`/vehicles?mode=${m.id}`} className="path card">
                <span className="path-icon">
                  <Icon name={modeIcons[m.id] ?? 'car'} size={24} color="var(--color-orange-400)" />
                </span>
                <span>
                  <span className="t-title">{m.label}</span>
                  <span className="muted t-label">{m.blurb}</span>
                </span>
                <Icon name="arrowRight" size={18} className="path-arrow" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Featured</span>
              <h2 className="t-h2">Fresh on the marketplace</h2>
            </div>
            <Link href="/vehicles" className="btn btn-ghost">
              See all <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </Reveal>
        <Carousel label="Featured vehicles" autoPlay>
          {vehicles.slice(0, 6).map((v, i) => (
            <div key={v.id} className="slide">
              <VehicleCard vehicle={v} index={i} />
            </div>
          ))}
        </Carousel>
      </section>

      <section id="how" className="container section">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="t-h2">From first look to the keys in your hand</h2>
            </div>
          </div>
        </Reveal>
        <ol className="how">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.05} y={18}>
                <div className="how-step card">
                  <span className="how-num">{i + 1}</span>
                  <Icon name={s.icon} size={24} color="var(--color-orange-400)" />
                  <h3 className="t-title">{s.title}</h3>
                  <p className="muted t-label">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
