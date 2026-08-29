export const APP_NAME = "RideWithMe";

export type ListingType = "buy" | "rent" | "lease" | "auction";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  listingType: ListingType;
  mileage: number;
  imageUrl: string;
  location: string;
  /** ISO timestamp — only present for auction listings */
  auctionEndsAt?: string;
}

const hoursFromNow = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 12000,
    listingType: "buy",
    mileage: 18000,
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
    location: "Lagos",
  },
  {
    id: "2",
    make: "Honda",
    model: "CR-V",
    year: 2021,
    price: 450,
    listingType: "rent",
    mileage: 25000,
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600",
    location: "Abuja",
  },
  {
    id: "3",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2023,
    price: 850,
    listingType: "lease",
    mileage: 5000,
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600",
    location: "Lagos",
  },
  {
    id: "4",
    make: "Ford",
    model: "Mustang",
    year: 2020,
    price: 22000,
    listingType: "auction",
    mileage: 32000,
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=600",
    location: "Port Harcourt",
    auctionEndsAt: hoursFromNow(26),
  },
];

export interface VehicleFilters {
  listingType?: ListingType;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

export function filterVehicles(vehicles: Vehicle[], filters: VehicleFilters): Vehicle[] {
  return vehicles.filter((v) => {
    if (filters.listingType && v.listingType !== filters.listingType) return false;
    if (filters.minPrice && v.price < filters.minPrice) return false;
    if (filters.maxPrice && v.price > filters.maxPrice) return false;
    if (filters.minYear && v.year < filters.minYear) return false;
    if (filters.maxYear && v.year > filters.maxYear) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${v.make} ${v.model} ${v.year}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export type SortOption = "default" | "price-asc" | "price-desc" | "year-desc" | "mileage-asc";

export function sortVehicles(vehicles: Vehicle[], sortBy: SortOption): Vehicle[] {
  if (sortBy === "default") return vehicles;
  const sorted = [...vehicles];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "year-desc":
      return sorted.sort((a, b) => b.year - a.year);
    case "mileage-asc":
      return sorted.sort((a, b) => a.mileage - b.mileage);
    default:
      return sorted;
  }
}

export function formatPrice(price: number, listingType: ListingType): string {
  const amount = `$${price.toLocaleString()}`;
  if (listingType === "rent") return `${amount}/day`;
  if (listingType === "lease") return `${amount}/mo`;
  return amount;
}

export function getVehicleById(vehicles: Vehicle[], id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}
