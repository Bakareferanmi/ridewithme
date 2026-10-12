'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';
import { findVehicle, formatKm, formatNaira, vehicleName, type Vehicle } from '@rwm/shared';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { useCompare } from './Providers';

const rows: { label: string; value: (v: Vehicle) => string }[] = [
  { label: 'Price', value: (v) => formatNaira(v.price) },
  { label: 'Year', value: (v) => String(v.year) },
  { label: 'Mileage', value: (v) => formatKm(v.mileageKm) },
  { label: 'Body', value: (v) => v.body },
  { label: 'Fuel', value: (v) => v.fuel },
  { label: 'Transmission', value: (v) => v.transmission },
  { label: 'Location', value: (v) => v.location },
  { label: 'Rent per day', value: (v) => (v.rentPerDay ? formatNaira(v.rentPerDay) : 'Not offered') },
  { label: 'Lease per month', value: (v) => (v.leasePerMonth ? formatNaira(v.leasePerMonth) : 'Not offered') },
  { label: 'Inspected', value: (v) => (v.inspected ? 'Yes' : 'Pending') },
];

export function CompareTray() {
  const { ids, toggle, clear } = useCompare();
  const [open, setOpen] = useState(false);
  const list = ids.map(findVehicle).filter((v): v is Vehicle => Boolean(v));

  useEffect(() => {
    if (ids.length < 2) setOpen(false);
  }, [ids.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {ids.length > 0 ? (
          <motion.div
            className="tray"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={motionTokens.spring}
          >
            <div className="tray-items">
              <AnimatePresence initial={false}>
                {list.map((v) => (
                  <motion.span key={v.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="tray-chip">
                    {v.make} {v.model}
                    <button aria-label={`Remove ${vehicleName(v)} from compare`} onClick={() => toggle(v.id)}>
                      <Icon name="close" size={14} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <div className="tray-actions">
              <button className="btn btn-ghost btn-sm" onClick={clear}>
                Clear
              </button>
              <button className="btn btn-primary btn-sm" disabled={ids.length < 2} onClick={() => setOpen(true)}>
                <Icon name="compare" size={16} /> Compare ({ids.length})
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div
              className="modal compare-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Compare vehicles"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.35, ease: motionTokens.ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <h2 className="t-h3">Compare vehicles</h2>
                <button className="btn btn-secondary btn-icon btn-sm" aria-label="Close" onClick={() => setOpen(false)}>
                  <Icon name="close" size={18} />
                </button>
              </div>
              <div className="table-wrap">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th scope="col" />
                      {list.map((v) => (
                        <th scope="col" key={v.id}>
                          {vehicleName(v)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <motion.tr key={row.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                        <th scope="row">{row.label}</th>
                        {list.map((v) => (
                          <td key={v.id}>{row.value(v)}</td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
