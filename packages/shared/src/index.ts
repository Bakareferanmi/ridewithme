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
  images: string[];
  location: string;
  /** ISO timestamp — only present for auction listings */
  auctionEndsAt?: string;
  /** Present once a "buy" listing has been purchased (demo only) */
  status?: "available" | "sold";
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
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=800",
      "https://images.unsplash.com/photo-1547245324-d777c6f05e80?w=800",
    ],
    location: "Port Harcourt",
    auctionEndsAt: hoursFromNow(26),
  },
  {
    id: "5",
    make: "Lexus",
    model: "RX 350",
    year: 2022,
    price: 31000,
    listingType: "buy",
    mileage: 14000,
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
    ],
    location: "Lagos",
  },
  {
    id: "6",
    make: "BMW",
    model: "X5",
    year: 2021,
    price: 620,
    listingType: "rent",
    mileage: 21000,
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
      "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=800",
    ],
    location: "Abuja",
  },
  {
    id: "7",
    make: "Volkswagen",
    model: "Tiguan",
    year: 2023,
    price: 520,
    listingType: "lease",
    mileage: 3000,
    images: [
      "https://images.unsplash.com/photo-1622551958625-baa2fb0cee43?w=800",
      "https://images.unsplash.com/photo-1541348263662-e068662d82af?w=800",
    ],
    location: "Ibadan",
  },
  {
    id: "8",
    make: "Chevrolet",
    model: "Camaro",
    year: 2019,
    price: 18500,
    listingType: "auction",
    mileage: 41000,
    images: [
      "https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=800",
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800",
    ],
    location: "Lagos",
    auctionEndsAt: hoursFromNow(4),
  },
  {
    id: "9",
    make: "Toyota",
    model: "Hilux",
    year: 2020,
    price: 16500,
    listingType: "buy",
    mileage: 45000,
    images: [
      "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800",
      "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=800",
    ],
    location: "Kano",
  },
  {
    id: "10",
    make: "Kia",
    model: "Sportage",
    year: 2022,
    price: 380,
    listingType: "rent",
    mileage: 12000,
    images: [
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=800",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
    ],
    location: "Port Harcourt",
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
