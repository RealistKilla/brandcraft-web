"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface User {
  id: string;
  company: string | null;
  jobTitle: string | null;
  industry: string | null;
  location: string | null;
  age: string | null;
  signupDate: string;
  monthlySpendUsd: number | null;
  active: boolean;
}

interface RecentUsersTableProps {
  users: User[];
}

export function RecentUsersTable({ users }: RecentUsersTableProps) {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Job Title</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Signup Date</TableHead>
          <TableHead className="text-right">Monthly Spend</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.company || '-'}
            </TableCell>
            <TableCell>{user.jobTitle || '-'}</TableCell>
            <TableCell>{user.industry || '-'}</TableCell>
            <TableCell>{user.location || '-'}</TableCell>
            <TableCell>{user.age || '-'}</TableCell>
            <TableCell>
              {format(new Date(user.signupDate), 'MMM d, yyyy')}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(user.monthlySpendUsd)}
            </TableCell>
            <TableCell>
              <Badge 
                variant={user.active ? "default" : "secondary"}
                className={user.active ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : ""}
              >
                {user.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}