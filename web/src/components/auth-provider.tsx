import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import { Link, useNavigate } from 'react-router-dom';

import { authClient } from '@/lib/auth-client';
import { ENV } from '@/lib/env';

interface BetterAuthLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const BetterAuthLink = ({ href, className, children }: BetterAuthLinkProps) => {
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={navigate}
      social={{
        providers: ['google'],
      }}
      redirectTo={ENV.FRONTEND_URL}
      onSessionChange={() => {
        // Clear router cache (protected routes)
        navigate(0);
      }}
      Link={BetterAuthLink}
    >
      {children}
    </AuthUIProvider>
  );
};
