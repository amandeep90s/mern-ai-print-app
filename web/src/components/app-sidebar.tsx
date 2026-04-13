import { Home, Settings, TagIcon, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

import Logo from './logo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';

export default function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const items = [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'Listings',
      url: '/listings',
      icon: TagIcon,
    },
    {
      title: 'Orders',
      url: '/orders',
      icon: Wallet,
    },
    {
      title: 'Settings',
      url: '/account/settings',
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="pt-2">
          <Logo isCollapsed={state === 'collapsed'} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-1">
            {items.map(({ title, icon: Icon, url }) => (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton
                  size="lg"
                  className={cn(
                    'hover:bg-secondary text-base',
                    url === location.pathname && 'bg-primary! text-white!',
                  )}
                  isActive={url === location.pathname}
                  asChild
                >
                  <Link
                    to={url}
                    className={cn(
                      'flex',
                      state === 'expanded'
                        ? 'gap-2'
                        : 'items-center justify-center',
                    )}
                  >
                    <Icon className="size-6! stroke-1!" />
                    {state === 'expanded' && <span>{title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
