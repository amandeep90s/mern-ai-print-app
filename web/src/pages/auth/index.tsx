import { AuthView } from '@daveyplate/better-auth-ui';
import { useLocation } from 'react-router-dom';

import Logo from '@/components/logo';

export default function AuthPage() {
  const { pathname } = useLocation();

  return (
    <main className="container mx-auto flex h-screen grow flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-2">
        <Logo className="text-2xl" />
      </div>

      <AuthView pathname={pathname} />
    </main>
  );
}
