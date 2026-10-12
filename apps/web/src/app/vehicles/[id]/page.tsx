import { findVehicle, vehicleName, vehicles, type ListingMode } from '@rwm/shared';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VehicleDetail } from '@/components/VehicleDetail';

type Params = { id: string };
type Search = { mode?: string };

export function generateStaticParams(): Params[] {
  return vehicles.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const v = findVehicle(id);
  return { title: v ? vehicleName(v) : 'Vehicle' };
}

const isMode = (v: string | undefined): v is ListingMode => v === 'buy' || v === 'rent' || v === 'lease' || v === 'auction';

export default async function VehiclePage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> }) {
  const { id } = await params;
  const { mode } = await searchParams;
  const vehicle = findVehicle(id);
  if (!vehicle) notFound();
  return <VehicleDetail vehicle={vehicle} initialMode={isMode(mode) ? mode : undefined} />;
}
