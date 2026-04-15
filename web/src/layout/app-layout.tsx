import { Outlet } from 'react-router-dom';

import AppSidebar from '@/components/app-sidebar';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout() {
  return (
    <SidebarProvider className="min-h-screen">
      <AppSidebar />

      <main className="mx-auto flex h-full min-h-screen w-full flex-col">
        <Header />

        <div className="mt-5 flex-1">
          <Outlet />
        </div>

        <Footer />
      </main>
    </SidebarProvider>
  );
}
