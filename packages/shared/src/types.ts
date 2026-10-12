export type ListingMode = 'buy' | 'rent' | 'lease' | 'auction';
export type BodyType = 'SUV' | 'Sedan' | 'Coupe' | 'Truck' | 'Hatchback';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';

export interface AuctionInfo {
  currentBid: number;
  bidCount: number;
  /** Time left when the data was loaded. Clients count down from this. */
  endsInMs: number;
  minIncrement: number;
}

export interface Vehicle {
  id: string;
  /** Unsplash photo ids (without the `photo-` prefix). First one is the cover. */
  photos: string[];
  make: string;
  model: string;
  trim: string;
  year: number;
  body: BodyType;
  fuel: FuelType;
  transmission: 'Automatic' | 'Manual';
  mileageKm: number;
  color: string;
  location: string;
  inspected: boolean;
  description: string;
  features: string[];
  /** Ways this vehicle can be acquired. */
  modes: ListingMode[];
  /** Buy price in naira. */
  price: number;
  rentPerDay?: number;
  leasePerMonth?: number;
  leaseTermMonths?: number;
  auction?: AuctionInfo;
}

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'mileage';

export interface VehicleQuery {
  search?: string;
  mode?: ListingMode;
  body?: BodyType[];
  fuel?: FuelType[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
}

export type OrderStatus = 'placed' | 'paid' | 'inspection' | 'delivery' | 'completed';
export type PaymentMethod = 'card' | 'transfer' | 'wallet';

export interface Order {
  id: string;
  vehicleId: string;
  vehicleName: string;
  mode: ListingMode;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface NewOrderInput {
  vehicleId: string;
  mode: ListingMode;
  amount: number;
  method: PaymentMethod;
  customer: { fullName: string; phone: string; email: string; address: string };
}

export interface Session {
  token: string;
  user: { id: string; name: string; email: string };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  city: string;
  joinedAt: string;
  orders: number;
  status: 'active' | 'pending' | 'blocked';
}

export interface Payment {
  id: string;
  reference: string;
  customer: string;
  amount: number;
  method: 'Card' | 'Transfer' | 'Wallet';
  status: 'paid' | 'pending' | 'failed';
  date: string;
}

export interface Transaction {
  id: string;
  vehicle: string;
  type: 'Sale' | 'Rental' | 'Lease' | 'Auction';
  customer: string;
  amount: number;
  /** Display amount, e.g. a monthly lease. */
  amountLabel: string;
  status: 'Paid' | 'Pending' | 'Active' | 'Failed';
  date: string;
}

export interface AdminKpi {
  id: string;
  label: string;
  value: number;
  format: 'naira-compact' | 'number';
  delta: string;
  tone: 'up' | 'down' | 'neutral';
}

export interface RevenuePoint {
  label: string;
  /** Revenue in millions of naira. */
  valueM: number;
}
