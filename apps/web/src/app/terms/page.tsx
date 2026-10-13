import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default function Page() {
  return (
    <div className="container page legal">
      <div className="page-head">
        <span className="eyebrow">Legal</span>
        <h1 className="t-h1">Terms & Conditions</h1>
        <p className="faint t-label">Last updated October 2026</p>
      </div>
      <div className="legal-body">
        <h2 className="t-h3">Acceptance</h2>
        <p className="muted">By using RideWithMe you agree to these terms. If you do not agree, please do not use the service.</p>
        <h2 className="t-h3">Accounts</h2>
        <p className="muted">You must provide accurate information and keep your login secure. You are responsible for activity on your account.</p>
        <h2 className="t-h3">Listings and inspections</h2>
        <p className="muted">Sellers are responsible for the accuracy of their listings. Inspection badges describe the checks completed at the time of inspection and are not a warranty.</p>
        <h2 className="t-h3">Buying, renting and leasing</h2>
        <p className="muted">Prices, deposits, rental periods and lease terms are shown before you confirm. Each transaction is also subject to the specific agreement presented at checkout.</p>
        <h2 className="t-h3">Auctions</h2>
        <p className="muted">A bid is a binding commitment to buy if you win. Bids cannot be withdrawn once placed, and reserve prices may apply.</p>
        <h2 className="t-h3">Prohibited use</h2>
        <p className="muted">You may not post false listings, interfere with the service, or use it for unlawful purposes.</p>
        <h2 className="t-h3">Liability</h2>
        <p className="muted">To the extent permitted by law, RideWithMe is not liable for indirect or consequential losses arising from use of the service.</p>
        <h2 className="t-h3">Changes and contact</h2>
        <p className="muted">We may update these terms from time to time. Questions: hello@ridewithme.app.</p>
      </div>
    </div>
  );
}
