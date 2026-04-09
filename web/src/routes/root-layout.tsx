import { Outlet, ScrollRestoration } from 'react-router-dom';

import { AuthProvider } from '@/components/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const RootLayout = () => (
  <QueryProvider>
    <TooltipProvider>
      <AuthProvider>
        <ScrollRestoration />
        <Outlet />
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </TooltipProvider>
  </QueryProvider>
);

export default RootLayout;
