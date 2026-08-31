import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  filterVehicles,
  sortVehicles,
  type ListingType,
  type SortOption,
} from '@ridewithme/shared'
import {
  GitCompare,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useVehicles } from '../hooks/useVehicles'
import { useToast } from '../hooks/useToast'
import { VehicleCard } from '../components/VehicleCard'

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

const MAX_COMPARE = 3

export function Home() {
  const navigate = useNavigate()
  const { vehicles: allVehicles } = useVehicles()
  const { isFavorite } = useFavorites()
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
  const [compareMode, setCompareMode] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const vehicles = useMemo(() => {
    const filtered = filterVehicles(allVehicles, {
      query: query || undefined,
      listingType: activeFilter === 'all' ? undefined : activeFilter,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minYear: minYear ? Number(minYear) : undefined,
      maxYear: maxYear ? Number(maxYear) : undefined,
    })
    const withFavorites = showFavoritesOnly ? filtered.filter((v) => isFavorite(v.id)) : filtered
    return sortVehicles(withFavorites, sortBy)
  }, [allVehicles, query, activeFilter, minPrice, maxPrice, minYear, maxYear, showFavoritesOnly, isFavorite, sortBy])

  const activeFilterCount = [minPrice, maxPrice, minYear, maxYear].filter(Boolean).length

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setMinYear('')
    setMaxYear('')
  }

  const toggleCompareMode = () => {
    setCompareMode((v) => !v)
    setCompareIds([])
  }

  const handleSelectToggle = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id)
      if (prev.length >= MAX_COMPARE) {
        showToast(`You can compare up to ${MAX_COMPARE} vehicles`)
        return prev
      }
      return [...prev, id]
    })
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

        <button
          className={`icon-btn ${compareMode ? 'icon-btn-active' : ''}`}
          onClick={toggleCompareMode}
          aria-label="Toggle comparison mode"
        >
          <GitCompare size={15} strokeWidth={2} />
          Compare
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

      {compareMode && (
        <p className="compare-hint">Select up to {MAX_COMPARE} vehicles to compare.</p>
      )}

      <div className="vehicle-grid">
        {vehicles.map((v, idx) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
            selectable={compareMode}
            selected={compareIds.includes(v.id)}
            onSelectToggle={handleSelectToggle}
          />
        ))}
        {vehicles.length === 0 && (
          <p className="empty">
            {showFavoritesOnly ? 'No saved vehicles yet.' : 'No vehicles match your search.'}
          </p>
        )}
      </div>

      {compareMode && compareIds.length >= 2 && (
        <button className="compare-fab" onClick={() => navigate(`/compare/${compareIds.join(',')}`)}>
          <GitCompare size={16} strokeWidth={2} />
          Compare {compareIds.length}
        </button>
      )}
    </div>
  )
}
