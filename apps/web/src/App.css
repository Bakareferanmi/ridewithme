import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Key, FileText, Gavel, ArrowRight } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TYPES: { label: string; icon: typeof ShoppingCart }[] = [
  { label: 'Buy', icon: ShoppingCart },
  { label: 'Rent', icon: Key },
  { label: 'Lease', icon: FileText },
  { label: 'Auction', icon: Gavel },
]

export function Welcome() {
  const navigate = useNavigate()

  useDocumentMeta({
    title: 'RideWithMe: Buy, Rent, Lease, or Bid on Vehicles',
    description: 'One platform for every way to drive. Buy, rent, lease, or bid on vehicles.',
  })

  return (
    <div className="welcome-page">
      <img
        className="welcome-hero-image"
        src="https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=1200&q=80"
        alt=""
        aria-hidden="true"
      />
      <div className="welcome-hero-overlay" />
      <div className="welcome-hero-accent" />

      <div className="welcome-top-row">
        <div className="welcome-brand">
          Ride<span>WithMe</span>
        </div>
        <div className="welcome-top-tagline">
          <span>Drive more</span>
          <span>possibilities</span>
          <span className="welcome-top-tagline-rule" />
        </div>
      </div>

      <div className="welcome-content">
        <span className="welcome-eyebrow">Vehicle Marketplace</span>
        <h1 className="welcome-headline">
          Every way<br />
          to <span>drive.</span>
        </h1>
        <p className="welcome-sub">
          Buy, rent, lease, or bid on your next vehicle, all in one place.
        </p>

        <div className="welcome-type-row">
          {TYPES.map(({ label, icon: Icon }) => (
            <div className="welcome-type-card" key={label}>
              <Icon size={20} strokeWidth={2} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="welcome-cta-group">
          <button className="action-btn welcome-cta-btn" onClick={() => navigate('/browse')}>
            Explore Vehicles
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <button className="welcome-link" onClick={() => navigate('/sell')}>
            List a vehicle instead
          </button>
        </div>
      </div>
    </div>
  )
}
