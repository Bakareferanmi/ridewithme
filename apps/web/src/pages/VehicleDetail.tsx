import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  MOCK_VEHICLES,
  getVehicleById,
  formatPrice,
  type ListingType,
} from '@ridewithme/shared'
import { ArrowLeft, Calendar, Gauge, Heart, MapPin, Tag } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { AuctionCountdown } from '../components/AuctionCountdown'

const ACTION_LABEL: Record<ListingType, string> = {
  buy: 'Buy Now',
  rent: 'Rent This',
  lease: 'Lease This',
  auction: 'Place Bid',
}

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()

  const vehicle = id ? getVehicleById(MOCK_VEHICLES, id) : undefined

  if (!vehicle) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="app">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to marketplace
      </button>
      <div className="detail">
        <div className="detail-image-wrap">
          <img className="detail-image" src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} />
          <button
            className={`favorite-btn favorite-btn-detail ${isFavorite(vehicle.id) ? 'favorite-btn-active' : ''}`}
            onClick={() => toggleFavorite(vehicle.id)}
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

          <button className="action-btn">{ACTION_LABEL[vehicle.listingType]}</button>
        </div>
      </div>
    </div>
  )
}
