import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  formatPrice,
  type ListingType,
} from '@ridewithme/shared'
import { ArrowLeft, Calendar, Gauge, Heart, MapPin, Tag } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { useVehicles } from '../hooks/useVehicles'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { AuctionCountdown } from '../components/AuctionCountdown'
import { ImageGallery } from '../components/ImageGallery'
import { VehicleCard } from '../components/VehicleCard'

const ACTION_LABEL: Record<ListingType, string> = {
  buy: 'Buy Now',
  rent: 'Rent This',
  lease: 'Lease This',
  auction: 'Place Bid',
}

const ACTION_TOAST: Record<ListingType, string> = {
  buy: 'Purchase request sent (demo)',
  rent: 'Rental request sent (demo)',
  lease: 'Lease request sent (demo)',
  auction: 'Bid placed (demo)',
}

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()
  const { vehicles } = useVehicles()

  const vehicle = id ? vehicles.find((v) => v.id === id) : undefined

  useDocumentMeta({
    title: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} · RideWithMe` : 'RideWithMe',
    description: vehicle
      ? `${formatPrice(vehicle.price, vehicle.listingType)} · ${vehicle.mileage.toLocaleString()} mi · ${vehicle.location}`
      : undefined,
    image: vehicle?.images[0],
  })

  if (!vehicle) {
    return <Navigate to="/" replace />
  }

  const sameMake = vehicles.filter((v) => v.id !== vehicle.id && v.make === vehicle.make)
  const sameType = vehicles.filter((v) => v.id !== vehicle.id && v.make !== vehicle.make && v.listingType === vehicle.listingType)
  const similar = [...sameMake, ...sameType].slice(0, 4)

  const handleToggleFavorite = () => {
    const wasFavorite = isFavorite(vehicle.id)
    toggleFavorite(vehicle.id)
    showToast(wasFavorite ? 'Removed from saved' : 'Saved to favorites')
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

          <button className="action-btn" onClick={() => showToast(ACTION_TOAST[vehicle.listingType])}>
            {ACTION_LABEL[vehicle.listingType]}
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
    </div>
  )
}
