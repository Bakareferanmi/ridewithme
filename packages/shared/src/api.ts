import { customers, adminKpis, findVehicle, payments, revenueSeries, transactions, vehicles as mockVehicles } from './mock';
import { filterVehicles } from './query';
import { vehicleName } from './format';
import type {
  AdminKpi,
  AuctionInfo,
  Customer,
  NewOrderInput,
  Order,
  Payment,
  RevenuePoint,
  Session,
  Transaction,
  Vehicle,
  VehicleQuery,
} from './types';
import type { LoginInput, SignupInput } from './schemas';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface ApiOptions {
  /** e.g. https://api.ridewithme.app/v1. When omitted the client serves local sample data. */
  baseUrl?: string;
  getToken?: () => string | null | undefined;
  /** Simulated network delay for sample data, so loading states are real. */
  mockLatencyMs?: number;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function toQueryString(q: VehicleQuery): string {
  const parts: string[] = [];
  const add = (k: string, v: string | number | undefined) => {
    if (v !== undefined && v !== '') parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  };
  add('search', q.search);
  add('mode', q.mode);
  add('body', q.body?.join(','));
  add('fuel', q.fuel?.join(','));
  add('minPrice', q.minPrice);
  add('maxPrice', q.maxPrice);
  add('sort', q.sort);
  return parts.length ? `?${parts.join('&')}` : '';
}

/**
 * Typed API client. Every screen talks to this, so switching from sample data to
 * a real backend is one environment variable (baseUrl) and no UI changes.
 */
export function createApiClient(options: ApiOptions = {}) {
  const { baseUrl, getToken, mockLatencyMs = 450 } = options;
  const live = Boolean(baseUrl);

  async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
    const token = getToken?.();
    const res = await fetch(`${baseUrl}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ApiError(text || res.statusText || 'Request failed', res.status);
    }
    return (await res.json()) as T;
  }

  async function mock<T>(fn: () => T): Promise<T> {
    await sleep(mockLatencyMs);
    return fn();
  }

  const sessionFor = (email: string, name?: string): Session => ({
    token: `mock-${Math.random().toString(36).slice(2)}`,
    user: {
      id: 'u1',
      email,
      name: name ?? email.split('@')[0]!.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    },
  });

  return {
    live,
    vehicles: {
      list: (q: VehicleQuery = {}): Promise<Vehicle[]> =>
        live ? request(`/vehicles${toQueryString(q)}`) : mock(() => filterVehicles(mockVehicles, q)),
      get: (id: string): Promise<Vehicle> =>
        live
          ? request(`/vehicles/${id}`)
          : mock(() => {
              const v = findVehicle(id);
              if (!v) throw new ApiError('Vehicle not found', 404);
              return v;
            }),
    },
    auctions: {
      list: (): Promise<Vehicle[]> =>
        live ? request('/auctions') : mock(() => mockVehicles.filter((v) => v.auction)),
      placeBid: (vehicleId: string, amount: number): Promise<AuctionInfo> =>
        live
          ? request(`/auctions/${vehicleId}/bids`, { method: 'POST', body: { amount } })
          : mock(() => {
              const v = findVehicle(vehicleId);
              if (!v?.auction) throw new ApiError('Auction not found', 404);
              const min = v.auction.currentBid + v.auction.minIncrement;
              if (amount < min) throw new ApiError('Your bid is below the minimum', 400);
              v.auction = { ...v.auction, currentBid: amount, bidCount: v.auction.bidCount + 1 };
              return v.auction;
            }),
    },
    orders: {
      create: (input: NewOrderInput): Promise<Order> =>
        live
          ? request('/orders', { method: 'POST', body: input })
          : mock(() => {
              const v = findVehicle(input.vehicleId);
              return {
                id: `ORD-${Math.floor(Math.random() * 90000 + 10000)}`,
                vehicleId: input.vehicleId,
                vehicleName: v ? vehicleName(v) : 'Vehicle',
                mode: input.mode,
                amount: input.amount,
                status: 'placed',
                createdAt: new Date().toISOString(),
              } satisfies Order;
            }),
      list: (): Promise<Order[]> =>
        live
          ? request('/orders')
          : mock(() => [
              { id: 'ORD-48213', vehicleId: 'v1', vehicleName: '2021 Toyota Camry XSE', mode: 'buy', amount: 18_500_000, status: 'inspection', createdAt: '2026-10-02T10:00:00.000Z' },
              { id: 'ORD-47102', vehicleId: 'v4', vehicleName: '2019 Honda CR-V EX', mode: 'rent', amount: 160_000, status: 'completed', createdAt: '2026-09-14T09:30:00.000Z' },
            ] satisfies Order[]),
    },
    auth: {
      login: (input: LoginInput): Promise<Session> =>
        live ? request('/auth/login', { method: 'POST', body: input }) : mock(() => sessionFor(input.email)),
      signup: (input: SignupInput): Promise<Session> =>
        live ? request('/auth/signup', { method: 'POST', body: input }) : mock(() => sessionFor(input.email, input.name)),
    },
    admin: {
      overview: (): Promise<{ kpis: AdminKpi[]; revenue: RevenuePoint[] }> =>
        live ? request('/admin/overview') : mock(() => ({ kpis: adminKpis, revenue: revenueSeries })),
      transactions: (): Promise<Transaction[]> => (live ? request('/admin/transactions') : mock(() => transactions)),
      customers: (): Promise<Customer[]> => (live ? request('/admin/customers') : mock(() => customers)),
      payments: (): Promise<Payment[]> => (live ? request('/admin/payments') : mock(() => payments)),
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
