import { UserButton } from '@daveyplate/better-auth-ui';

import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  return (
    <div className="bg-background h-12 w-full shrink-0">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>

        <UserButton
          className="bg-background! cursor-pointer shadow-none!"
          classNames={{
            trigger: {
              user: {
                title: 'text-black dark:text-white',
                subtitle: 'text-muted-foreground',
              },
              avatar: {
                fallback: 'bg-black! text-white!',
              },
              base: 'text-black',
            },
          }}
        />
      </div>
    </div>
  );
}
