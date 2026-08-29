import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MOCK_VEHICLES,
  filterVehicles,
  sortVehicles,
  formatPrice,
  type ListingType,
  type SortOption,
} from '@ridewithme/shared'
import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { AuctionCountdown } from '../components/AuctionCountdown'
import { VehicleImage } from '../components/VehicleImage'

const FILTER_TABS: { label: string; value: ListingType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
  { label: 'Auction', value: 'auction' },
]

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest Year', value: 'year-desc' },
  { label: 'Lowest Mileage', value: 'mileage-asc' },
]

export function Home() {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<ListingType | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minYear, setMinYear] = useState('')
  const [maxYear, setMaxYear] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const vehicles = useMemo(() => {
    const filtered = filterVehicles(MOCK_VEHICLES, {
      query: query || undefined,
      listingType: activeFilter === 'all' ? undefined : activeFilter,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minYear: minYear ? Number(minYear) : undefined,
      maxYear: maxYear ? Number(maxYear) : undefined,
    })
    const withFavorites = showFavoritesOnly ? filtered.filter((v) => isFavorite(v.id)) : filtered
    return sortVehicles(withFavorites, sortBy)
  }, [query, activeFilter, minPrice, maxPrice, minYear, maxYear, showFavoritesOnly, isFavorite, sortBy])

  const scrollTrack = (direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  const activeFilterCount = [minPrice, maxPrice, minYear, maxYear].filter(Boolean).length

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setMinYear('')
    setMaxYear('')
  }

  const handleToggleFavorite = (id: string, label: string) => {
    const wasFavorite = isFavorite(id)
    toggleFavorite(id)
    showToast(wasFavorite ? 'Removed from saved' : `Saved ${label}`)
  }

  return (
    <div className="app">
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
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

      <div className="toolbar">
        <button
          className={`icon-btn ${showFavoritesOnly ? 'icon-btn-active' : ''}`}
          onClick={() => setShowFavoritesOnly((v) => !v)}
          aria-label="Show favorites only"
        >
          <Heart size={15} strokeWidth={2} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          Saved
        </button>

        <button
          className={`icon-btn ${showFilterPanel ? 'icon-btn-active' : ''}`}
          onClick={() => setShowFilterPanel((v) => !v)}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={15} strokeWidth={2} />
          Filters
          {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
        </button>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          aria-label="Sort vehicles"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {showFilterPanel && (
        <div className="filter-panel">
          <div className="filter-row">
            <label className="filter-field">
              <span>Min price</span>
              <input type="number" inputMode="numeric" placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </label>
            <label className="filter-field">
              <span>Max price</span>
              <input type="number" inputMode="numeric" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </label>
          </div>
          <div className="filter-row">
            <label className="filter-field">
              <span>Min year</span>
              <input type="number" inputMode="numeric" placeholder="2015" value={minYear} onChange={(e) => setMinYear(e.target.value)} />
            </label>
            <label className="filter-field">
              <span>Max year</span>
              <input type="number" inputMode="numeric" placeholder="2026" value={maxYear} onChange={(e) => setMaxYear(e.target.value)} />
            </label>
          </div>
          {activeFilterCount > 0 && (
            <button className="filter-clear" onClick={clearFilters}>Clear filters</button>
          )}
        </div>
      )}

      <div className="carousel">
        <div className="carousel-track" ref={trackRef}>
          {vehicles.map((v, idx) => (
            <div
              className="vehicle-card"
              key={v.id}
              style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
              onClick={() => navigate(`/vehicle/${v.id}`)}
            >
              <div className="vehicle-card-image">
                <VehicleImage src={v.imageUrl} alt={`${v.make} ${v.model}`} />
                <span className={`badge badge-${v.listingType}`}>{v.listingType}</span>
                <button
                  className={`favorite-btn ${isFavorite(v.id) ? 'favorite-btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleFavorite(v.id, `${v.year} ${v.make} ${v.model}`)
                  }}
                  aria-label="Toggle favorite"
                >
                  <Heart size={14} strokeWidth={2} fill={isFavorite(v.id) ? 'currentColor' : 'none'} />
                </button>
                {v.listingType === 'auction' && v.auctionEndsAt && (
                  <AuctionCountdown endsAt={v.auctionEndsAt} compact />
                )}
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
          {vehicles.length === 0 && (
            <p className="empty">
              {showFavoritesOnly ? 'No saved vehicles yet.' : 'No vehicles match your search.'}
            </p>
          )}
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
