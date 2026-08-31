import { Fragment } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { formatPrice } from '@ridewithme/shared'
import { ArrowLeft, X } from 'lucide-react'
import { useVehicles } from '../hooks/useVehicles'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { VehicleImage } from '../components/VehicleImage'

export function Compare() {
  const { ids } = useParams<{ ids: string }>()
  const navigate = useNavigate()
  const { vehicles } = useVehicles()

  useDocumentMeta({ title: 'Compare · RideWithMe' })

  const selectedIds = (ids ?? '').split(',').filter(Boolean)
  const selected = selectedIds
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  if (selected.length < 2) {
    return <Navigate to="/" replace />
  }

  const removeOne = (id: string) => {
    const remaining = selectedIds.filter((i) => i !== id)
    if (remaining.length < 2) {
      navigate('/')
    } else {
      navigate(`/compare/${remaining.join(',')}`, { replace: true })
    }
  }

  const rows: { label: string; render: (v: (typeof selected)[number]) => string }[] = [
    { label: 'Price', render: (v) => formatPrice(v.price, v.listingType) },
    { label: 'Year', render: (v) => String(v.year) },
    { label: 'Mileage', render: (v) => `${v.mileage.toLocaleString()} mi` },
    { label: 'Location', render: (v) => v.location },
    { label: 'Listing type', render: (v) => v.listingType },
  ]

  return (
    <div className="app">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} strokeWidth={2} />
        Back to marketplace
      </button>

      <div className="compare-scroll">
        <div className="compare-table" style={{ gridTemplateColumns: `120px repeat(${selected.length}, 1fr)` }}>
          <div className="compare-cell compare-cell-header" />
          {selected.map((v) => (
            <div className="compare-cell compare-cell-header compare-vehicle" key={v.id}>
              <button className="compare-remove" onClick={() => removeOne(v.id)} aria-label="Remove from comparison">
                <X size={13} strokeWidth={2.5} />
              </button>
              <div className="compare-thumb">
                <VehicleImage src={v.images[0]} alt={`${v.make} ${v.model}`} />
              </div>
              <span className="compare-vehicle-name">{v.year} {v.make} {v.model}</span>
            </div>
          ))}

          {rows.map((row) => (
            <Fragment key={row.label}>
              <div className="compare-cell compare-row-label">{row.label}</div>
              {selected.map((v) => (
                <div className="compare-cell" key={`${row.label}-${v.id}`}>{row.render(v)}</div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
