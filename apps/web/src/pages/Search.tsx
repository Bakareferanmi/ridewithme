import { useEffect, useMemo, useRef, useState } from 'react'
import { Search as SearchIcon, X, Clock } from 'lucide-react'
import { filterVehicles } from '@ridewithme/shared'
import { useVehicles } from '../hooks/useVehicles'
import { useRecentSearches } from '../hooks/useRecentSearches'
import { VehicleCard } from '../components/VehicleCard'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function Search() {
  const { vehicles } = useVehicles()
  const { recent, addRecent, clearRecent } = useRecentSearches()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useDocumentMeta({
    title: 'Search · RideWithMe',
    description: 'Search vehicles by make, model, or year on RideWithMe.',
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const popularMakes = useMemo(() => {
    const counts = new Map<string, number>()
    vehicles.forEach((v) => counts.set(v.make, (counts.get(v.make) ?? 0) + 1))
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([make]) => make)
  }, [vehicles])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return filterVehicles(vehicles, { query })
  }, [vehicles, query])

  const runSearch = (term: string) => {
    setQuery(term)
    addRecent(term)
  }

  const handleResultClick = () => {
    if (query.trim()) addRecent(query)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Search</h1>
        <div className="search-wrap">
          <SearchIcon className="search-icon" size={17} strokeWidth={2} />
          <input
            ref={inputRef}
            className="search"
            type="text"
            placeholder="Search make, model, year..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRecent(query)}
          />
          {query && (
            <button className="search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </header>

      {!query.trim() ? (
        <>
          {recent.length > 0 && (
            <div className="search-section">
              <div className="search-section-head">
                <span className="search-section-title">Recent searches</span>
                <button className="search-section-clear" onClick={clearRecent}>Clear</button>
              </div>
              <div className="search-chip-row">
                {recent.map((term) => (
                  <button key={term} className="search-chip" onClick={() => runSearch(term)}>
                    <Clock size={13} strokeWidth={2} />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {popularMakes.length > 0 && (
            <div className="search-section">
              <span className="search-section-title">Popular makes</span>
              <div className="search-chip-row">
                {popularMakes.map((make) => (
                  <button key={make} className="search-chip search-chip-accent" onClick={() => runSearch(make)}>
                    {make}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="vehicle-grid" onClick={handleResultClick}>
          {results.map((v, idx) => (
            <VehicleCard key={v.id} vehicle={v} style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }} />
          ))}
          {results.length === 0 && (
            <p className="empty">No vehicles match "{query}".</p>
          )}
        </div>
      )}
    </div>
  )
}
