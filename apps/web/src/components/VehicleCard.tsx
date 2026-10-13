'use client';

import { motion } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { defaultMode, formatCompactNaira, formatKm, formatNaira, priceFor, vehicleName, type ListingMode, type Vehicle } from '@rwm/shared';
import Link from 'next/link';
import { Icon } from './Icon';
import { Countdown } from './motion';
import { useCompare, useFavorites } from './Providers';
import { VehiclePhoto } from './VehiclePhoto';

export function VehicleCard({ vehicle, mode, index = 0 }: { vehicle: Vehicle; mode?: ListingMode; index?: number }) {
  const favorites = useFavorites();
  const compare = useCompare();
  const shown: ListingMode = mode && vehicle.modes.includes(mode) ? mode : defaultMode(vehicle);
  const price = priceFor(vehicle, shown);
  const secondary = (['rent', 'lease'] as ListingMode[])
    .filter((m) => m !== shown)
    .map((m) => ({ m, p: priceFor(vehicle, m) }))
    .find((x) => x.p);
  const fav = favorites.has(vehicle.id);
  const comparing = compare.has(vehicle.id);
  const name = vehicleName(vehicle);

  return (
    <motion.article
      layout
      className="vcard"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05, ease: motionTokens.ease }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/vehicles/${vehicle.id}?mode=${shown}`} className="vcard-link" aria-label={`View ${name}`}>
        <div className="vcard-media">
          <VehiclePhoto photo={vehicle.photos[0]} alt={name} width={640} />
          <div className="vcard-badges">
            {vehicle.auction ? (
              <span className="badge badge-orange">
                <span className="live-dot" /> <Countdown endsInMs={vehicle.auction.endsInMs} />
              </span>
            ) : vehicle.inspected ? (
              <span className="badge badge-success">
                <Icon name="shield" size={14} /> Inspected
              </span>
            ) : (
              <span className="badge badge-warning">Inspection pending</span>
            )}
          </div>
        </div>
        <div className="vcard-body">
          <div>
            <h3 className="t-title">{name}</h3>
            <p className="muted t-label">
              {formatKm(vehicle.mileageKm)} · {vehicle.transmission} · {vehicle.fuel}
            </p>
          </div>
          <div className="vcard-price">
            {price ? (
              <div>
                <span className="faint t-caption">{price.label}</span>
                <p className="t-h3">
                  {shown === 'buy' ? formatNaira(price.amount) : formatCompactNaira(price.amount)}
                  <span className="suffix">{price.suffix}</span>
                </p>
              </div>
            ) : null}
            {secondary?.p ? (
              <span className="vcard-alt">
                {secondary.m === 'rent' ? 'Rent' : 'Lease'} {formatCompactNaira(secondary.p.amount)}
                {secondary.p.suffix}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <motion.button
        type="button"
        className={`vcard-fav ${fav ? 'is-on' : ''}`}
        aria-label={fav ? `Remove ${name} from favorites` : `Save ${name} to favorites`}
        aria-pressed={fav}
        onClick={() => favorites.toggle(vehicle.id)}
        whileTap={{ scale: 0.8 }}
      >
        <motion.span key={String(fav)} initial={{ scale: fav ? 0.4 : 1 }} animate={{ scale: 1 }} transition={motionTokens.spring} style={{ display: 'flex' }}>
          <Icon name="heart" size={20} fill={fav ? 'var(--color-orange-500)' : 'none'} color={fav ? 'var(--color-orange-500)' : 'currentColor'} />
        </motion.span>
      </motion.button>

      <button type="button" className={`vcard-compare ${comparing ? 'is-on' : ''}`} aria-pressed={comparing} onClick={() => compare.toggle(vehicle.id)}>
        <Icon name={comparing ? 'check' : 'compare'} size={14} />
        {comparing ? 'Added' : 'Compare'}
      </button>
    </motion.article>
  );
}
