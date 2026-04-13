import { Link } from 'react-router-dom';

import Logo from '@/components/logo';
import { PROTECTED_ROUTES } from '@/routes/routes';

const NAV_LINKS = [
  { label: 'Home', to: PROTECTED_ROUTES.HOME },
  { label: 'Listings', to: PROTECTED_ROUTES.LISTINGS },
  { label: 'Orders', to: PROTECTED_ROUTES.ORDERS },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-background mt-auto border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
        <Logo />

        <nav className="flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-muted-foreground text-sm">
          &copy; {year} AI Print. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
