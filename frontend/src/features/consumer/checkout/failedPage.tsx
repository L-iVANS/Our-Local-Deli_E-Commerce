'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckoutFailedContent } from './components/CheckoutFailedContent';

export default function B2BCheckoutFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('orderId');
    setOrderId(id);
  }, [searchParams]);

  const handleBackHome = () => router.push('/b2b/home');

  const handleRetryPayment = () => {
    if (orderId) {
      router.push(`/orders/${orderId}?action=pay`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <CheckoutFailedContent
        orderId={orderId}
        onBackHome={handleBackHome}
        onRetryPayment={handleRetryPayment}
        retryDisabled={!orderId}
      />
    </div>
  );
}
