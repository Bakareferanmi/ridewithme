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
        src="https://images.unsplash.com/photo-1728060703475-d17c93c0b430?w=1400&q=80"
        alt=""
        aria-hidden="true"
      />
      <div className="welcome-hero-overlay" />

      <div className="welcome-brand">
        Ride<span>WithMe</span>
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
            <div className="welcome-type-item" key={label}>
              <Icon size={17} strokeWidth={2} />
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
