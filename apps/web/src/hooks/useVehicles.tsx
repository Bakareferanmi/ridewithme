import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { MOCK_VEHICLES, type Vehicle } from '@ridewithme/shared'

const STORAGE_KEY = 'ridewithme:my-listings'

function readStoredListings(): Vehicle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Vehicle[]
  } catch {
    return []
  }
}

export type NewVehicleInput = Omit<Vehicle, 'id'>

interface VehiclesContextValue {
  vehicles: Vehicle[]
  myListings: Vehicle[]
  addVehicle: (input: NewVehicleInput) => Vehicle
  updateVehicle: (id: string, input: NewVehicleInput) => void
  deleteVehicle: (id: string) => void
}

const VehiclesContext = createContext<VehiclesContextValue | null>(null)

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [myListings, setMyListings] = useState<Vehicle[]>(() => readStoredListings())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myListings))
  }, [myListings])

  const addVehicle = useCallback((input: NewVehicleInput) => {
    const vehicle: Vehicle = { ...input, id: `mine-${Date.now()}` }
    setMyListings((prev) => [vehicle, ...prev])
    return vehicle
  }, [])

  const updateVehicle = useCallback((id: string, input: NewVehicleInput) => {
    setMyListings((prev) => prev.map((v) => (v.id === id ? { ...input, id } : v)))
  }, [])

  const deleteVehicle = useCallback((id: string) => {
    setMyListings((prev) => prev.filter((v) => v.id !== id))
  }, [])

  const vehicles = [...myListings, ...MOCK_VEHICLES]

  return (
    <VehiclesContext.Provider value={{ vehicles, myListings, addVehicle, updateVehicle, deleteVehicle }}>
      {children}
    </VehiclesContext.Provider>
  )
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext)
  if (!ctx) throw new Error('useVehicles must be used within VehiclesProvider')
  return ctx
}
