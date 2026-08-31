import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  formatPrice,
  type ListingType,
} from '@ridewithme/shared'
import { ArrowLeft, Calendar, Gauge, Gavel, Heart, MapPin, Tag } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { useVehicles } from '../hooks/useVehicles'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { AuctionCountdown } from '../components/AuctionCountdown'
import { ImageGallery } from '../components/ImageGallery'
import { VehicleCard } from '../components/VehicleCard'
import { ActionModal, Stepper } from '../components/ActionModal'

const ACTION_LABEL: Record<ListingType, string> = {
  buy: 'Buy Now',
  rent: 'Rent This',
  lease: 'Lease This',
  auction: 'Place Bid',
}

const LEASE_TERMS = [12, 24, 36]
const BID_INCREMENT = 500

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()
  const { vehicles, purchaseVehicle, placeBid } = useVehicles()

  const vehicle = id ? vehicles.find((v) => v.id === id) : undefined

  useDocumentMeta({
    title: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} · RideWithMe` : 'RideWithMe',
    description: vehicle
      ? `${formatPrice(vehicle.price, vehicle.listingType)} · ${vehicle.mileage.toLocaleString()} mi · ${vehicle.location}`
      : undefined,
    image: vehicle?.images[0],
  })

  const [showModal, setShowModal] = useState(false)
  const [rentDays, setRentDays] = useState(1)
  const [leaseTerm, setLeaseTerm] = useState(12)
  const [bidAmount, setBidAmount] = useState(0)

  if (!vehicle) {
    return <Navigate to="/" replace />
  }

  const sameMake = vehicles.filter((v) => v.id !== vehicle.id && v.make === vehicle.make)
  const sameType = vehicles.filter((v) => v.id !== vehicle.id && v.make !== vehicle.make && v.listingType === vehicle.listingType)
  const similar = [...sameMake, ...sameType].slice(0, 4)

  const auctionEnded = vehicle.listingType === 'auction' && vehicle.auctionEndsAt
    ? new Date(vehicle.auctionEndsAt).getTime() <= Date.now()
    : false
  const isSold = vehicle.status === 'sold'
  const actionDisabled = isSold || auctionEnded

  const handleToggleFavorite = () => {
    const wasFavorite = isFavorite(vehicle.id)
    toggleFavorite(vehicle.id)
    showToast(wasFavorite ? 'Removed from saved' : 'Saved to favorites')
  }

  const openModal = () => {
    if (vehicle.listingType === 'auction') {
      setBidAmount(vehicle.price + BID_INCREMENT)
    }
    setShowModal(true)
  }

  const confirmPurchase = () => {
    purchaseVehicle(vehicle.id)
    showToast('Purchase confirmed (demo)')
    setShowModal(false)
  }

  const confirmRental = () => {
    const total = vehicle.price * rentDays
    showToast(`Rental confirmed — ${rentDays} day${rentDays > 1 ? 's' : ''}, $${total.toLocaleString()} total`)
    setShowModal(false)
  }

  const confirmLease = () => {
    showToast(`Lease confirmed — ${leaseTerm}-month term at ${formatPrice(vehicle.price, 'lease')}`)
    setShowModal(false)
  }

  const confirmBid = () => {
    if (bidAmount <= vehicle.price) {
      showToast(`Bid must be higher than $${vehicle.price.toLocaleString()}`)
      return
    }
    placeBid(vehicle.id, bidAmount)
    showToast(`Bid placed — you're now the highest bidder at $${bidAmount.toLocaleString()}`)
    setShowModal(false)
  }

  return (
    <div className="app">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to marketplace
      </button>
      <div className="detail">
        <div className="detail-image-wrap">
          <ImageGallery images={vehicle.images} alt={`${vehicle.make} ${vehicle.model}`} />
          <button
            className={`favorite-btn favorite-btn-detail ${isFavorite(vehicle.id) ? 'favorite-btn-active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label="Toggle favorite"
          >
            <Heart size={18} strokeWidth={2} fill={isFavorite(vehicle.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="detail-body">
          <span className={`badge badge-${vehicle.listingType}`}>{vehicle.listingType}</span>
          <h1 className="detail-title">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
          <p className="detail-price">{formatPrice(vehicle.price, vehicle.listingType)}</p>

          {vehicle.listingType === 'auction' && vehicle.auctionEndsAt && (
            <div className="detail-countdown">
              <AuctionCountdown endsAt={vehicle.auctionEndsAt} />
            </div>
          )}

          <div className="spec-grid">
            <div className="spec">
              <span className="spec-label"><Gauge size={13} strokeWidth={2} /> Mileage</span>
              <span className="spec-value">{vehicle.mileage.toLocaleString()} mi</span>
            </div>
            <div className="spec">
              <span className="spec-label"><MapPin size={13} strokeWidth={2} /> Location</span>
              <span className="spec-value">{vehicle.location}</span>
            </div>
            <div className="spec">
              <span className="spec-label"><Calendar size={13} strokeWidth={2} /> Year</span>
              <span className="spec-value">{vehicle.year}</span>
            </div>
            <div className="spec">
              <span className="spec-label"><Tag size={13} strokeWidth={2} /> Type</span>
              <span className="spec-value">{vehicle.listingType}</span>
            </div>
          </div>

          <button className="action-btn" onClick={openModal} disabled={actionDisabled}>
            {isSold ? 'Sold' : auctionEnded ? 'Auction ended' : ACTION_LABEL[vehicle.listingType]}
          </button>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="similar-section">
          <h2 className="similar-title">Similar vehicles</h2>
          <div className="vehicle-grid">
            {similar.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      )}

      {showModal && vehicle.listingType === 'buy' && (
        <ActionModal title="Confirm purchase" onClose={() => setShowModal(false)}>
          <p className="action-modal-summary">
            {vehicle.year} {vehicle.make} {vehicle.model} — {formatPrice(vehicle.price, 'buy')}
          </p>
          <p className="action-modal-note">Demo checkout — no real payment will be made.</p>
          <button className="action-btn" onClick={confirmPurchase}>Confirm Purchase</button>
        </ActionModal>
      )}

      {showModal && vehicle.listingType === 'rent' && (
        <ActionModal title="Rent this vehicle" onClose={() => setShowModal(false)}>
          <div className="action-modal-row">
            <span>Number of days</span>
            <Stepper value={rentDays} onChange={setRentDays} min={1} max={30} />
          </div>
          <p className="action-modal-total">Total: ${(vehicle.price * rentDays).toLocaleString()}</p>
          <button className="action-btn" onClick={confirmRental}>Confirm Rental</button>
        </ActionModal>
      )}

      {showModal && vehicle.listingType === 'lease' && (
        <ActionModal title="Lease this vehicle" onClose={() => setShowModal(false)}>
          <div className="action-modal-row">
            <span>Lease term</span>
          </div>
          <div className="lease-term-grid">
            {LEASE_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                className={`sell-type-btn ${leaseTerm === term ? 'sell-type-btn-active' : ''}`}
                onClick={() => setLeaseTerm(term)}
              >
                {term} mo
              </button>
            ))}
          </div>
          <p className="action-modal-total">{formatPrice(vehicle.price, 'lease')} for {leaseTerm} months</p>
          <button className="action-btn" onClick={confirmLease}>Confirm Lease</button>
        </ActionModal>
      )}

      {showModal && vehicle.listingType === 'auction' && (
        <ActionModal title="Place a bid" onClose={() => setShowModal(false)}>
          <p className="action-modal-summary">
            <Gavel size={14} strokeWidth={2} /> Current bid: ${vehicle.price.toLocaleString()}
          </p>
          <label className="sell-field">
            <span>Your bid ($)</span>
            <input
              type="number"
              inputMode="numeric"
              value={bidAmount}
              min={vehicle.price + 1}
              step={BID_INCREMENT}
              onChange={(e) => setBidAmount(Number(e.target.value))}
            />
          </label>
          <button className="action-btn" onClick={confirmBid}>Place Bid</button>
        </ActionModal>
      )}
    </div>
  )
}
