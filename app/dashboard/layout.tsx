'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const routes = [
    {
      href: '/dashboard',
      label: 'Overview',
      active: pathname === '/dashboard',
    },
    {
      href: '/dashboard/analytics',
      label: 'Analytics',
      active: pathname === '/dashboard/analytics',
    },
    {
      href: '/dashboard/personas',
      label: 'Personas',
      active: pathname === '/dashboard/personas',
    },
    {
      href: '/dashboard/campaigns',
      label: 'Campaigns',
      active: pathname === '/dashboard/campaigns',
    },
    {
      href: '/dashboard/content',
      label: 'Content',
      active: pathname === '/dashboard/content',
    },
    {
      href: '/dashboard/applications',
      label: 'Applications',
      active: pathname === '/dashboard/applications',
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      active: pathname === '/dashboard/settings',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <div className="border-b">
          <div className="container flex h-16 items-center px-4">
            <nav className="flex items-center space-x-4 lg:space-x-6">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="container p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}