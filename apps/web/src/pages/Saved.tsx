import { Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleCard } from '../components/VehicleCard'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function Saved() {
  const { favorites } = useFavorites()
  const { vehicles } = useVehicles()

  useDocumentMeta({
    title: 'Saved · RideWithMe',
    description: 'Your saved vehicles on RideWithMe.',
  })

  const savedVehicles = vehicles.filter((v) => favorites.has(v.id))

  return (
    <div className="app">
      <header className="header">
        <h1>Saved</h1>
      </header>

      {savedVehicles.length === 0 ? (
        <div className="saved-empty">
          <Heart size={28} strokeWidth={1.5} />
          <p>No saved vehicles yet.</p>
          <span>Tap the heart on any listing to save it here.</span>
        </div>
      ) : (
        <div className="saved-grid">
          {savedVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  )
}
