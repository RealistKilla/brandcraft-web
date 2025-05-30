"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const pages = [
  {
    path: "/",
    title: "Homepage",
    views: 12453,
    conversion: 3.2,
    trend: "up",
  },
  {
    path: "/products",
    title: "Products Page",
    views: 8932,
    conversion: 2.8,
    trend: "down",
  },
  {
    path: "/about",
    title: "About Us",
    views: 6423,
    conversion: 1.5,
    trend: "up",
  },
  {
    path: "/blog/getting-started",
    title: "Getting Started with Next.js",
    views: 5834,
    conversion: 4.3,
    trend: "up",
  },
  {
    path: "/contact",
    title: "Contact Page",
    views: 3752,
    conversion: 5.7,
    trend: "neutral",
  },
];

export function TopPages() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Page</TableHead>
          <TableHead className="hidden md:table-cell">Path</TableHead>
          <TableHead className="text-right">Views</TableHead>
          <TableHead className="text-right">Conversion</TableHead>
          <TableHead className="text-right">Trend</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page) => (
          <TableRow key={page.path}>
            <TableCell className="font-medium">{page.title}</TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {page.path}
            </TableCell>
            <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
            <TableCell className="text-right">{page.conversion}%</TableCell>
            <TableCell className="text-right">
              <Badge
                variant="outline"
                className={cn({
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30":
                    page.trend === "up",
                  "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30":
                    page.trend === "down",
                  "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200 dark:border-gray-500/30":
                    page.trend === "neutral",
                })}
              >
                {page.trend === "up" ? "↑" : page.trend === "down" ? "↓" : "→"}{" "}
                {page.trend.charAt(0).toUpperCase() + page.trend.slice(1)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}