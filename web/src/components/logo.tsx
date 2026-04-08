import { cn } from '@/lib/utils';
import { PROTECTED_ROUTES } from '@/routes/routes';
import { ShirtIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  isCollapsed?: boolean;
  className?: string;
}

export default function Logo({ isCollapsed = false, className }: LogoProps) {
  return (
    <Link
      to={PROTECTED_ROUTES.HOME}
      className={cn(
        'group flex shrink-0 items-center gap-2 transition-all select-none',
        className,
      )}
    >
      <div
        className={cn(
          'from-primary to-primary/80 text-primary-foreground flex size-8 items-center justify-center',
          'rounded-xl bg-linear-to-tr shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md',
        )}
      >
        <ShirtIcon className="size-4 shrink-0" />
      </div>
      <span
        className={cn(
          'text-foreground text-xl font-bold tracking-tight',
          isCollapsed ? 'hidden' : 'block',
          className,
        )}
      >
        AI Print
      </span>
    </Link>
  );
}
