import type { Vehicle, VehicleQuery } from './types';

/** Filters and sorts a vehicle list. Used by the mock API and by clients that filter locally. */
export function filterVehicles(list: Vehicle[], q: VehicleQuery = {}): Vehicle[] {
  const search = q.search?.trim().toLowerCase();
  let out = list.filter((v) => {
    if (q.mode && !v.modes.includes(q.mode)) return false;
    if (q.body?.length && !q.body.includes(v.body)) return false;
    if (q.fuel?.length && !q.fuel.includes(v.fuel)) return false;
    if (q.minPrice !== undefined && v.price < q.minPrice) return false;
    if (q.maxPrice !== undefined && v.price > q.maxPrice) return false;
    if (search) {
      const hay = `${v.year} ${v.make} ${v.model} ${v.trim} ${v.body} ${v.fuel} ${v.location}`.toLowerCase();
      if (!search.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
    return true;
  });

  switch (q.sort) {
    case 'price-asc':
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case 'mileage':
      out = [...out].sort((a, b) => a.mileageKm - b.mileageKm);
      break;
    default:
      out = [...out].sort((a, b) => b.year - a.year);
  }
  return out;
}
