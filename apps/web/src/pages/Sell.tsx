import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ListingType } from '@ridewithme/shared'
import { useVehicles } from '../hooks/useVehicles'
import { useToast } from '../hooks/useToast'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const LISTING_TYPES: { label: string; value: ListingType }[] = [
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
  { label: 'Auction', value: 'auction' },
]

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800'

export function Sell() {
  const navigate = useNavigate()
  const { addVehicle } = useVehicles()
  const { showToast } = useToast()

  useDocumentMeta({
    title: 'Sell your vehicle · RideWithMe',
    description: 'List your vehicle for sale, rent, lease, or auction on RideWithMe.',
  })

  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [price, setPrice] = useState('')
  const [mileage, setMileage] = useState('')
  const [location, setLocation] = useState('')
  const [listingType, setListingType] = useState<ListingType>('buy')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!make || !model || !year || !price || !mileage || !location) return

    const vehicle = addVehicle({
      make,
      model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      location,
      listingType,
      images: [imageUrl.trim() || PLACEHOLDER_IMAGE],
      ...(listingType === 'auction'
        ? { auctionEndsAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() }
        : {}),
    })

    showToast('Listing published')
    navigate(`/vehicle/${vehicle.id}`)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Sell a vehicle</h1>
      </header>

      <form className="sell-form" onSubmit={handleSubmit}>
        <div className="sell-row">
          <label className="sell-field">
            <span>Make</span>
            <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Toyota" required />
          </label>
          <label className="sell-field">
            <span>Model</span>
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Camry" required />
          </label>
        </div>

        <div className="sell-row">
          <label className="sell-field">
            <span>Year</span>
            <input type="number" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2022" required />
          </label>
          <label className="sell-field">
            <span>Mileage</span>
            <input type="number" inputMode="numeric" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="18000" required />
          </label>
        </div>

        <label className="sell-field">
          <span>Location</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lagos" required />
        </label>

        <label className="sell-field">
          <span>Listing type</span>
          <div className="sell-type-grid">
            {LISTING_TYPES.map((t) => (
              <button
                type="button"
                key={t.value}
                className={`sell-type-btn ${listingType === t.value ? 'sell-type-btn-active' : ''}`}
                onClick={() => setListingType(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </label>

        <label className="sell-field">
          <span>Price {listingType === 'rent' ? '(per day)' : listingType === 'lease' ? '(per month)' : ''}</span>
          <input type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12000" required />
        </label>

        <label className="sell-field">
          <span>Photo URL (optional)</span>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </label>

        <button className="action-btn" type="submit">Publish listing</button>
      </form>
    </div>
  )
}
