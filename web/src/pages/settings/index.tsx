import { AccountView } from '@daveyplate/better-auth-ui';
import { useLocation } from 'react-router-dom';

export default function SettingsPage() {
  const { pathname } = useLocation();

  return (
    <main className="container px-2 py-4">
      <AccountView pathname={pathname} />
    </main>
  );
}
