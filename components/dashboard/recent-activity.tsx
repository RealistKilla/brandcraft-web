"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const activities = [
  {
    id: "1",
    type: "payment",
    status: "completed",
    amount: "$250.00",
    date: "2023-05-21T10:30:00",
    user: {
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "A",
    },
  },
  {
    id: "2",
    type: "subscription",
    status: "pending",
    amount: "$19.99",
    date: "2023-05-20T14:45:00",
    user: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      avatar: "S",
    },
  },
  {
    id: "3",
    type: "refund",
    status: "completed",
    amount: "$120.00",
    date: "2023-05-19T09:15:00",
    user: {
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: "M",
    },
  },
  {
    id: "4",
    type: "payment",
    status: "failed",
    amount: "$350.00",
    date: "2023-05-18T16:20:00",
    user: {
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "E",
    },
  },
  {
    id: "5",
    type: "subscription",
    status: "completed",
    amount: "$29.99",
    date: "2023-05-17T11:05:00",
    user: {
      name: "David Wilson",
      email: "david@example.com",
      avatar: "D",
    },
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-4 rounded-lg border p-3"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.user.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} ({activity.amount})
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                {
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400":
                    activity.status === "completed",
                  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400":
                    activity.status === "pending",
                  "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400":
                    activity.status === "failed",
                }
              )}
            >
              {activity.status}
            </span>
            <time className="text-xs text-muted-foreground">
              {format(new Date(activity.date), "MMM d, h:mm a")}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}