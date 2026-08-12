import { useState, useMemo } from 'react'
import { APP_NAME, MOCK_VEHICLES, filterVehicles, formatPrice, type ListingType } from '@ridewithme/shared'
import './App.css'

const FILTER_TABS: { label: string; value: ListingType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
  { label: 'Auction', value: 'auction' },
]

function App() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<ListingType | 'all'>('all')

  const vehicles = useMemo(() => {
    return filterVehicles(MOCK_VEHICLES, {
      query: query || undefined,
      listingType: activeFilter === 'all' ? undefined : activeFilter,
    })
  }, [query, activeFilter])

  return (
    <div className="app">
      <header className="header">
        <h1>{APP_NAME}</h1>
        <input
          className="search"
          type="text"
          placeholder="Search make, model, year..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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

      <div className="grid">
        {vehicles.map((v) => (
          <div className="vehicle-card" key={v.id}>
            <img src={v.imageUrl} alt={`${v.make} ${v.model}`} />
            <div className="vehicle-info">
              <h3>{v.year} {v.make} {v.model}</h3>
              <p className="price">{formatPrice(v.price, v.listingType)}</p>
              <p className="meta">{v.mileage.toLocaleString()} mi · {v.location}</p>
              <span className={`badge badge-${v.listingType}`}>{v.listingType}</span>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && <p className="empty">No vehicles match your search.</p>}
      </div>
    </div>
  )
}

export default App
