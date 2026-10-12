import type { Metadata } from 'next';
import { AuctionsView } from '@/components/AuctionsView';

export const metadata: Metadata = { title: 'Auctions' };

export default function AuctionsPage() {
  return (
    <div className="container page">
      <div className="page-head">
        <span className="eyebrow">Auctions</span>
        <h1 className="t-h1">Bid live, win fair</h1>
        <p className="muted">Every auction vehicle is inspected. Bids are binding and the highest bid wins.</p>
      </div>
      <AuctionsView />
    </div>
  );
}
