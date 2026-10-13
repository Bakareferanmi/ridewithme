import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function Page() {
  return (
    <div className="container page legal">
      <div className="page-head">
        <span className="eyebrow">Legal</span>
        <h1 className="t-h1">Privacy Policy</h1>
        <p className="faint t-label">Last updated October 2026</p>
      </div>
      <div className="legal-body">
        <h2 className="t-h3">Who we are</h2>
        <p className="muted">RideWithMe is a vehicle marketplace where you can buy, rent, lease and bid on inspected vehicles. This policy explains what information we collect and how we use it.</p>
        <h2 className="t-h3">Information we collect</h2>
        <p className="muted">Account details you give us (name, email, phone), the vehicles you save, compare, rent, lease, buy or bid on, payment and delivery details needed to complete a transaction, and basic device and usage data such as pages visited.</p>
        <h2 className="t-h3">How we use it</h2>
        <p className="muted">To run your account, process listings, bookings, leases, purchases and bids, verify identity and prevent fraud, send transaction updates, and improve the service.</p>
        <h2 className="t-h3">Sharing</h2>
        <p className="muted">We share information with sellers and hosts only as needed to complete a transaction, and with payment, hosting and analytics providers who process it for us. We do not sell your personal information.</p>
        <h2 className="t-h3">Retention and security</h2>
        <p className="muted">We keep information only as long as needed for the purposes above or as required by law, and use reasonable technical and organisational safeguards to protect it.</p>
        <h2 className="t-h3">Your choices</h2>
        <p className="muted">You can access, correct or delete your information, and opt out of marketing messages, by contacting us.</p>
        <h2 className="t-h3">Contact</h2>
        <p className="muted">Questions about this policy: hello@ridewithme.app.</p>
      </div>
    </div>
  );
}
