import { Home, Settings, TagIcon, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
        <div className="px-1 pt-2">
          <Logo isCollapsed={state === 'collapsed'} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="list-none! px-1">
            {items.map(({ title, icon: Icon, url }) => (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-primary text-base hover:text-white"
                  isActive={url === location.pathname}
                  asChild
                >
                  <Link to={url}>
                    <Icon className="size-6!" />
                    <span>{title}</span>
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
