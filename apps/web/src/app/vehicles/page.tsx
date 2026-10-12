import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VehicleExplorer } from '@/components/VehicleExplorer';

export const metadata: Metadata = { title: 'Marketplace' };

export default function VehiclesPage() {
  return (
    <div className="container page">
      <div className="page-head">
        <span className="eyebrow">Marketplace</span>
        <h1 className="t-h1">Find your next ride</h1>
      </div>
      <Suspense fallback={null}>
        <VehicleExplorer />
      </Suspense>
    </div>
  );
}
