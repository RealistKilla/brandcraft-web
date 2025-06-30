"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { User, MapPin, Calendar, Building } from "lucide-react";

interface User {
  id: string;
  jobTitle: string;
  location: string;
  age: string;
  industry: string;
  signupDate: string;
  monthlySpendUsd: number | null;
  active: boolean;
}

interface RecentActivityProps {
  users: User[];
}

export function RecentActivity({ users }: RecentActivityProps) {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-muted p-6 w-16 h-16 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium mb-1">No new users</h3>
        <p className="text-xs text-muted-foreground">
          No platform users have signed up in the last 7 days.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-start gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none truncate">
                {user.jobTitle}
              </p>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  user.active
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                )}
              >
                {user.active ? "Active" : "Inactive"}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{user.location}</span>
                <span className="mx-1">•</span>
                <span>{user.age}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building className="h-3 w-3" />
                <span className="truncate">{user.industry}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <time>
                  {format(new Date(user.signupDate), "MMM d, h:mm a")}
                </time>
              </div>
              <span className="text-xs font-medium">
                {formatCurrency(user.monthlySpendUsd)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}