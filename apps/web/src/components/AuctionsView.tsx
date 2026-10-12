'use client';

import { motion } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { formatKm, formatNaira, vehicleName } from '@rwm/shared';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAsync } from '@/lib/hooks';
import { Icon } from './Icon';
import { Countdown } from './motion';
import { EmptyState, ErrorState } from './StateViews';
import { VehiclePhoto } from './VehiclePhoto';

export function AuctionsView() {
  const { data, loading, error, reload } = useAsync(() => api.auctions.list(), []);

  if (error) return <ErrorState onRetry={reload} />;
  if (loading)
    return (
      <div className="auction-list">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 190 }} />
        ))}
      </div>
    );
  if (!data?.length) return <EmptyState icon="auction" title="No live auctions" body="Check back soon." />;

  return (
    <div className="auction-list">
      {data.map((v, i) => (
        <motion.article
          key={v.id}
          className="card auction-card"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: motionTokens.ease }}
          whileHover={{ y: -4 }}
        >
          <div className="auction-media">
            <VehiclePhoto photo={v.photos[0]} alt={vehicleName(v)} width={480} size={52} />
          </div>
          <div className="auction-info">
            <div>
              <span className="badge badge-orange">
                <span className="live-dot" /> Live
              </span>
              <h2 className="t-h3">{vehicleName(v)}</h2>
              <p className="muted t-label">
                {v.location} · {formatKm(v.mileageKm)}
              </p>
            </div>
            <div className="auction-stats">
              <div>
                <span className="faint t-caption">Current bid</span>
                <p className="t-h3">{formatNaira(v.auction!.currentBid)}</p>
              </div>
              <div>
                <span className="faint t-caption">Ends in</span>
                <p className="t-h3">
                  <Countdown endsInMs={v.auction!.endsInMs} />
                </p>
              </div>
              <div>
                <span className="faint t-caption">Bids</span>
                <p className="t-h3">{v.auction!.bidCount}</p>
              </div>
            </div>
          </div>
          <Link href={`/vehicles/${v.id}?mode=auction`} className="btn btn-primary">
            Place bid <Icon name="arrowRight" size={16} strokeWidth={2.2} />
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
