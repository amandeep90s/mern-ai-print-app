import { Navigate, Outlet } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/routes/routes';

const RouteGuard = ({ requireAuth }: { requireAuth: boolean }) => {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  if (!requireAuth && data?.user) {
    return <Navigate to={PROTECTED_ROUTES.HOME} replace />;
  }

  if (requireAuth && !data?.user) {
    return <Navigate to={AUTH_ROUTES.SIGN_IN} replace />;
  }

  return <Outlet />;
};

export default RouteGuard;
