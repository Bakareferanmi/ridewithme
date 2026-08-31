import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatPrice, type ListingType } from '@ridewithme/shared'
import { Pencil, Trash2 } from 'lucide-react'
import { useVehicles } from '../hooks/useVehicles'
import { useToast } from '../hooks/useToast'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { VehicleImage } from '../components/VehicleImage'

const LISTING_TYPES: { label: string; value: ListingType }[] = [
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
  { label: 'Auction', value: 'auction' },
]

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800'

export function Sell() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { myListings, addVehicle, updateVehicle, deleteVehicle } = useVehicles()
  const { showToast } = useToast()

  const editingVehicle = id ? myListings.find((v) => v.id === id) : undefined
  const isEditing = Boolean(id)

  useDocumentMeta({
    title: isEditing ? 'Edit listing · RideWithMe' : 'Sell your vehicle · RideWithMe',
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

  useEffect(() => {
    if (editingVehicle) {
      setMake(editingVehicle.make)
      setModel(editingVehicle.model)
      setYear(String(editingVehicle.year))
      setPrice(String(editingVehicle.price))
      setMileage(String(editingVehicle.mileage))
      setLocation(editingVehicle.location)
      setListingType(editingVehicle.listingType)
      setImageUrl(editingVehicle.images[0] ?? '')
    }
  }, [editingVehicle])

  if (id && !editingVehicle) {
    navigate('/sell', { replace: true })
    return null
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!make || !model || !year || !price || !mileage || !location) return

    const input = {
      make,
      model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      location,
      listingType,
      images: [imageUrl.trim() || PLACEHOLDER_IMAGE],
      ...(listingType === 'auction'
        ? { auctionEndsAt: editingVehicle?.auctionEndsAt ?? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() }
        : {}),
    }

    if (isEditing && id) {
      updateVehicle(id, input)
      showToast('Listing updated')
      navigate(`/vehicle/${id}`)
    } else {
      const vehicle = addVehicle(input)
      showToast('Listing published')
      navigate(`/vehicle/${vehicle.id}`)
    }
  }

  const handleDelete = (deleteId: string) => {
    if (window.confirm('Delete this listing? This cannot be undone.')) {
      deleteVehicle(deleteId)
      showToast('Listing deleted')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>{isEditing ? 'Edit listing' : 'Sell a vehicle'}</h1>
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

        <button className="action-btn" type="submit">{isEditing ? 'Save changes' : 'Publish listing'}</button>
      </form>

      {!isEditing && myListings.length > 0 && (
        <div className="my-listings">
          <h2 className="my-listings-title">Your listings</h2>
          <div className="my-listings-list">
            {myListings.map((v) => (
              <div className="my-listing-row" key={v.id}>
                <div className="my-listing-thumb">
                  <VehicleImage src={v.images[0]} alt={`${v.make} ${v.model}`} />
                </div>
                <div className="my-listing-info">
                  <span className="my-listing-name">{v.year} {v.make} {v.model}</span>
                  <span className="my-listing-price">{formatPrice(v.price, v.listingType)}</span>
                </div>
                <button className="my-listing-action" onClick={() => navigate(`/sell/${v.id}`)} aria-label="Edit listing">
                  <Pencil size={15} strokeWidth={2} />
                </button>
                <button className="my-listing-action my-listing-action-danger" onClick={() => handleDelete(v.id)} aria-label="Delete listing">
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
