"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart, 
  Settings, 
  Users, 
  FileText, 
  Target,
  Grid3X3,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface SidebarProps {
  user: User;
}

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Personas",
    href: "/dashboard/personas",
    icon: Users,
  },
  {
    title: "Campaigns",
    href: "/dashboard/campaigns",
    icon: Target,
  },
  {
    title: "Content",
    href: "/dashboard/content",
    icon: FileText,
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
    icon: Grid3X3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="hidden md:flex h-screen border-r flex-col w-64">
      <div className="p-6">
        <Link href="/\" className="flex items-center space-x-2">
          <span className="font-bold text-xl">Next.js 15</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 py-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-transparent hover:text-primary"
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
               user.email?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Signing out...
            </>
          ) : (
            <>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
            </>
          )}
        </Button>
      </div>
    </div>
  );
}