import type { ListingMode, Vehicle } from './types';

/** Manual grouping so output is identical on server, browser and Hermes. */
const group = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatNaira = (n: number) => `₦${group(n)}`;

export function formatCompactNaira(n: number): string {
  const trim = (x: number) => String(Math.round(x * 10) / 10);
  if (n >= 1_000_000_000) return `₦${trim(n / 1_000_000_000)}B`;
  if (n >= 1_000_000) return `₦${trim(n / 1_000_000)}M`;
  if (n >= 1_000) return `₦${trim(n / 1_000)}k`;
  return `₦${n}`;
}

export const formatKm = (n: number) => `${group(n)} km`;

export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Ended';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}m ${String(sec).padStart(2, '0')}s`;
}

export const vehicleName = (v: Vehicle) => `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`;

export const modeLabel = (mode: ListingMode) =>
  ({ buy: 'Buy', rent: 'Rent', lease: 'Lease', auction: 'Auction' })[mode];

export interface PriceInfo {
  label: string;
  amount: number;
  suffix: string;
}

/** The headline price for a vehicle in a given mode, or null when it is not offered that way. */
export function priceFor(v: Vehicle, mode: ListingMode): PriceInfo | null {
  switch (mode) {
    case 'buy':
      return v.modes.includes('buy') ? { label: 'Buy for', amount: v.price, suffix: '' } : null;
    case 'rent':
      return v.rentPerDay ? { label: 'Rent from', amount: v.rentPerDay, suffix: ' / day' } : null;
    case 'lease':
      return v.leasePerMonth ? { label: 'Lease from', amount: v.leasePerMonth, suffix: ' / mo' } : null;
    case 'auction':
      return v.auction ? { label: 'Current bid', amount: v.auction.currentBid, suffix: '' } : null;
  }
}

/** What the customer pays today: the full price, the rental total, the first lease month or the current bid. */
export function orderAmount(v: Vehicle, mode: ListingMode, opts: { days?: number } = {}): number {
  switch (mode) {
    case 'buy':
      return v.price;
    case 'rent':
      return (v.rentPerDay ?? 0) * Math.max(1, opts.days ?? 1);
    case 'lease':
      return v.leasePerMonth ?? 0;
    case 'auction':
      return v.auction?.currentBid ?? 0;
  }
}

/** First mode a vehicle is offered in, used as the default headline. */
export const defaultMode = (v: Vehicle): ListingMode => v.modes[0] ?? 'buy';

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

/** Unsplash image URL, resized by their CDN. Photos by Unsplash contributors, see unsplash.com/license. */
export const photoUrl = (id: string, width = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;
