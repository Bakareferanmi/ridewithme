import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutFlow } from '@/components/CheckoutFlow';

export const metadata: Metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutFlow />
    </Suspense>
  );
}
