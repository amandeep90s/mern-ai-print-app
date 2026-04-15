import { UserButton } from '@daveyplate/better-auth-ui';

import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  return (
    <div className="bg-background w-full shrink-0">
      <div className="flex items-center justify-between border-b px-4 py-2 shadow-sm">
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
