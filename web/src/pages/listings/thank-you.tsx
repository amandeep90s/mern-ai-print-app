import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import Logo from '@/components/logo';

export default function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="mb-2 h-14 w-full bg-white shadow-sm dark:bg-black/80">
      <header className="mb-2 h-14 w-full bg-white shadow-sm dark:bg-black/80">
        <div className="mx-auto w-full max-w-7xl p-2.5">
          <Logo />
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-1 items-center justify-center">
        <div className="max-w-md space-y-4 px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. We'll send a confirmation to your email
            shortly.
          </p>
          {orderId && (
            <p className="text-muted-foreground text-xs">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
