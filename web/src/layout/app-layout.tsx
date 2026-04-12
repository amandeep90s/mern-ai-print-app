import { Outlet } from 'react-router-dom';

import AppSidebar from '@/components/app-sidebar';
import Header from '@/components/header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout() {
  return (
    <SidebarProvider className="min-h-screen">
      <AppSidebar />

      <main className="mx-auto flex h-full w-full flex-col">
        <Header />

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
