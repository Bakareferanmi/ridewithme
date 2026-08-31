import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice, type Vehicle } from '@ridewithme/shared'
import { Check, Gauge, Heart, MapPin } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { AuctionCountdown } from './AuctionCountdown'
import { VehicleImage } from './VehicleImage'

interface VehicleCardProps {
  vehicle: Vehicle
  style?: CSSProperties
  selectable?: boolean
  selected?: boolean
  onSelectToggle?: (id: string) => void
}

export function VehicleCard({ vehicle, style, selectable, selected, onSelectToggle }: VehicleCardProps) {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const wasFavorite = isFavorite(vehicle.id)
    toggleFavorite(vehicle.id)
    showToast(wasFavorite ? 'Removed from saved' : `Saved ${vehicle.year} ${vehicle.make} ${vehicle.model}`)
  }

  const handleClick = () => {
    if (selectable && onSelectToggle) {
      onSelectToggle(vehicle.id)
    } else {
      navigate(`/vehicle/${vehicle.id}`)
    }
  }

  return (
    <div
      className={`vehicle-card ${selected ? 'vehicle-card-selected' : ''}`}
      style={style}
      onClick={handleClick}
    >
      <div className="vehicle-card-image">
        <VehicleImage src={vehicle.images[0]} alt={`${vehicle.make} ${vehicle.model}`} />
        <span className={`badge badge-${vehicle.listingType}`}>{vehicle.listingType}</span>
        {vehicle.status === 'sold' && <span className="sold-ribbon">Sold</span>}
        {selectable ? (
          <span className={`select-check ${selected ? 'select-check-active' : ''}`}>
            {selected && <Check size={13} strokeWidth={3} />}
          </span>
        ) : (
          <button
            className={`favorite-btn ${isFavorite(vehicle.id) ? 'favorite-btn-active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label="Toggle favorite"
          >
            <Heart size={14} strokeWidth={2} fill={isFavorite(vehicle.id) ? 'currentColor' : 'none'} />
          </button>
        )}
        {vehicle.listingType === 'auction' && vehicle.auctionEndsAt && (
          <AuctionCountdown endsAt={vehicle.auctionEndsAt} compact />
        )}
      </div>
      <div className="vehicle-info">
        <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p className="price">{formatPrice(vehicle.price, vehicle.listingType)}</p>
        <div className="meta">
          <span><Gauge size={12} strokeWidth={2} /> {(vehicle.mileage / 1000).toFixed(0)}k mi</span>
          <span><MapPin size={12} strokeWidth={2} /> {vehicle.location}</span>
        </div>
      </div>
    </div>
  )
}
