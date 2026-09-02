import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TYPES: { label: string; dotClass: string }[] = [
  { label: 'Buy', dotClass: 'mode-dot-buy' },
  { label: 'Rent', dotClass: 'mode-dot-rent' },
  { label: 'Lease', dotClass: 'mode-dot-lease' },
  { label: 'Auction', dotClass: 'mode-dot-auction' },
]

export function Welcome() {
  const navigate = useNavigate()

  useDocumentMeta({
    title: 'RideWithMe — Buy, Rent, Lease, or Bid on Vehicles',
    description: 'One platform for every way to drive — buy, rent, lease, or bid on vehicles.',
  })

  return (
    <div className="welcome-page">
      <span className="welcome-ring welcome-ring-outer" />
      <span className="welcome-ring welcome-ring-inner" />

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
          Buy, rent, lease, or bid on your next vehicle — all in one place.
        </p>

        <div className="welcome-divider" />

        <div className="welcome-type-row">
          {TYPES.map((t) => (
            <span className="welcome-type-item" key={t.label}>
              <span className={`mode-dot ${t.dotClass}`} />
              {t.label}
            </span>
          ))}
        </div>

        <div className="welcome-cta-group">
          <button className="action-btn" onClick={() => navigate('/browse')}>
            Explore Vehicles
            <ArrowRight size={16} strokeWidth={2} />
          </button>
          <button className="welcome-link" onClick={() => navigate('/sell')}>
            List a vehicle instead
          </button>
        </div>
      </div>
    </div>
  )
}
