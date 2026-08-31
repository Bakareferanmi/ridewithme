import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { MOCK_VEHICLES, type Vehicle } from '@ridewithme/shared'

const LISTINGS_KEY = 'ridewithme:my-listings'
const OVERRIDES_KEY = 'ridewithme:overrides'

type VehicleOverride = Partial<Pick<Vehicle, 'price' | 'status'>>

function readStoredListings(): Vehicle[] {
  try {
    const raw = localStorage.getItem(LISTINGS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Vehicle[]
  } catch {
    return []
  }
}

function readStoredOverrides(): Record<string, VehicleOverride> {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, VehicleOverride>
  } catch {
    return {}
  }
}

export type NewVehicleInput = Omit<Vehicle, 'id'>

interface VehiclesContextValue {
  vehicles: Vehicle[]
  myListings: Vehicle[]
  addVehicle: (input: NewVehicleInput) => Vehicle
  updateVehicle: (id: string, input: NewVehicleInput) => void
  deleteVehicle: (id: string) => void
  purchaseVehicle: (id: string) => void
  placeBid: (id: string, amount: number) => void
}

const VehiclesContext = createContext<VehiclesContextValue | null>(null)

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [myListings, setMyListings] = useState<Vehicle[]>(() => readStoredListings())
  const [overrides, setOverrides] = useState<Record<string, VehicleOverride>>(() => readStoredOverrides())

  useEffect(() => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(myListings))
  }, [myListings])

  useEffect(() => {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))
  }, [overrides])

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

  const purchaseVehicle = useCallback((id: string) => {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], status: 'sold' } }))
  }, [])

  const placeBid = useCallback((id: string, amount: number) => {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], price: amount } }))
  }, [])

  const baseVehicles = [...myListings, ...MOCK_VEHICLES]
  const vehicles = baseVehicles.map((v) => (overrides[v.id] ? { ...v, ...overrides[v.id] } : v))

  return (
    <VehiclesContext.Provider
      value={{ vehicles, myListings, addVehicle, updateVehicle, deleteVehicle, purchaseVehicle, placeBid }}
    >
      {children}
    </VehiclesContext.Provider>
  )
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext)
  if (!ctx) throw new Error('useVehicles must be used within VehiclesProvider')
  return ctx
}
