"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Week 1", visitors: 4000, pageViews: 8400 },
  { name: "Week 2", visitors: 3000, pageViews: 7800 },
  { name: "Week 3", visitors: 5000, pageViews: 9800 },
  { name: "Week 4", visitors: 8000, pageViews: 12000 },
  { name: "Week 5", visitors: 6000, pageViews: 11000 },
  { name: "Week 6", visitors: 7000, pageViews: 13000 },
  { name: "Week 7", visitors: 9000, pageViews: 15000 },
  { name: "Week 8", visitors: 10000, pageViews: 17000 },
];

export function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="pageViews"
          stackId="1"
          stroke="hsl(var(--chart-1))"
          fill="hsl(var(--chart-1) / 0.2)"
        />
        <Area
          type="monotone"
          dataKey="visitors"
          stackId="2"
          stroke="hsl(var(--chart-2))"
          fill="hsl(var(--chart-2) / 0.2)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}