import { useMemo, useRef, useState } from 'react'
import {
  MOCK_VEHICLES,
  filterVehicles,
  formatPrice,
  getVehicleById,
  type ListingType,
} from '@ridewithme/shared'
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Gauge,
  MapPin,
  Search,
  Tag,
} from 'lucide-react'
import './App.css'

const FILTER_TABS: { label: string; value: ListingType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
  { label: 'Auction', value: 'auction' },
]

const ACTION_LABEL: Record<ListingType, string> = {
  buy: 'Buy Now',
  rent: 'Rent This',
  lease: 'Lease This',
  auction: 'Place Bid',
}

const MODE_CHIPS: { label: string; value: ListingType }[] = [
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
  { label: 'Auction', value: 'auction' },
]

function App() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<ListingType | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const vehicles = useMemo(() => {
    return filterVehicles(MOCK_VEHICLES, {
      query: query || undefined,
      listingType: activeFilter === 'all' ? undefined : activeFilter,
    })
  }, [query, activeFilter])

  const selectedVehicle = selectedId ? getVehicleById(MOCK_VEHICLES, selectedId) : undefined

  const scrollTrack = (direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  if (selectedVehicle) {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setSelectedId(null)}>
          <ArrowLeft size={16} strokeWidth={2} />
          Back to marketplace
        </button>
        <div className="detail">
          <img className="detail-image" src={selectedVehicle.imageUrl} alt={`${selectedVehicle.make} ${selectedVehicle.model}`} />
          <div className="detail-body">
            <span className={`badge badge-${selectedVehicle.listingType}`}>{selectedVehicle.listingType}</span>
            <h1 className="detail-title">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</h1>
            <p className="detail-price">{formatPrice(selectedVehicle.price, selectedVehicle.listingType)}</p>

            <div className="spec-grid">
              <div className="spec">
                <span className="spec-label"><Gauge size={13} strokeWidth={2} /> Mileage</span>
                <span className="spec-value">{selectedVehicle.mileage.toLocaleString()} mi</span>
              </div>
              <div className="spec">
                <span className="spec-label"><MapPin size={13} strokeWidth={2} /> Location</span>
                <span className="spec-value">{selectedVehicle.location}</span>
              </div>
              <div className="spec">
                <span className="spec-label"><Calendar size={13} strokeWidth={2} /> Year</span>
                <span className="spec-value">{selectedVehicle.year}</span>
              </div>
              <div className="spec">
                <span className="spec-label"><Tag size={13} strokeWidth={2} /> Type</span>
                <span className="spec-value">{selectedVehicle.listingType}</span>
              </div>
            </div>

            <button className="action-btn">{ACTION_LABEL[selectedVehicle.listingType]}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <section className="hero">
        <h2 className="hero-title">
          One platform.<br />
          <span>Every way</span> to drive.
        </h2>
        <p className="hero-subtitle">
          Buy, rent, lease, or bid on your next vehicle — all in one place.
        </p>
        <div className="mode-chips">
          {MODE_CHIPS.map((mode) => (
            <button
              key={mode.value}
              className="mode-chip"
              onClick={() => setActiveFilter(mode.value)}
            >
              <span className={`mode-dot mode-dot-${mode.value}`} />
              {mode.label}
            </button>
          ))}
        </div>
      </section>

      <header className="header">
        <h1>Ride<span>WithMe</span></h1>
        <div className="search-wrap">
          <Search className="search-icon" size={17} strokeWidth={2} />
          <input
            className="search"
            type="text"
            placeholder="Search make, model, year..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="tabs">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`tab ${activeFilter === tab.value ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="carousel">
        <div className="carousel-track" ref={trackRef}>
          {vehicles.map((v) => (
            <div className="vehicle-card" key={v.id} onClick={() => setSelectedId(v.id)}>
              <div className="vehicle-card-image">
                <img src={v.imageUrl} alt={`${v.make} ${v.model}`} loading="lazy" />
                <span className={`badge badge-${v.listingType}`}>{v.listingType}</span>
              </div>
              <div className="vehicle-info">
                <h3>{v.year} {v.make} {v.model}</h3>
                <p className="price">{formatPrice(v.price, v.listingType)}</p>
                <div className="meta">
                  <span><Gauge size={12} strokeWidth={2} /> {(v.mileage / 1000).toFixed(0)}k mi</span>
                  <span><MapPin size={12} strokeWidth={2} /> {v.location}</span>
                </div>
              </div>
            </div>
          ))}
          {vehicles.length === 0 && <p className="empty">No vehicles match your search.</p>}
        </div>
        {vehicles.length > 0 && (
          <>
            <button className="carousel-nav carousel-nav-prev" onClick={() => scrollTrack(-1)} aria-label="Scroll left">
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button className="carousel-nav carousel-nav-next" onClick={() => scrollTrack(1)} aria-label="Scroll right">
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default App
