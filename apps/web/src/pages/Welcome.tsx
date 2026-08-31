import { useNavigate } from 'react-router-dom'
import { Search, Tag } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const MODES: { label: string; dotClass: string }[] = [
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
      <div className="welcome-glow" />
      <h1 className="welcome-title">
        Ride<span>WithMe</span>
      </h1>
      <p className="welcome-tagline">
        One platform. Every way to drive.
      </p>

      <div className="welcome-modes">
        {MODES.map((mode) => (
          <span className="welcome-mode-chip" key={mode.label}>
            <span className={`mode-dot ${mode.dotClass}`} />
            {mode.label}
          </span>
        ))}
      </div>

      <div className="welcome-actions">
        <button className="action-btn" onClick={() => navigate('/browse')}>
          <Search size={16} strokeWidth={2} />
          Start Browsing
        </button>
        <button className="welcome-secondary-btn" onClick={() => navigate('/sell')}>
          <Tag size={15} strokeWidth={2} />
          List a Vehicle
        </button>
      </div>
    </div>
  )
}
