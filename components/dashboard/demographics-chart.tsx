"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface DemographicsChartProps {
  data: Array<{
    name: string;
    count: number;
  }>;
  type: 'industry' | 'age' | 'location';
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
];

export function DemographicsChart({ data, type }: DemographicsChartProps) {
  // Sort data by count and take top 5 to avoid overcrowding
  const sortedData = data
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const total = sortedData.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="count"
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const percentage = ((data.count / total) * 100).toFixed(1);
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.count} users ({percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="space-y-2">
        {sortedData.map((item, index) => {
          const percentage = ((item.count / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate max-w-[120px]" title={item.name}>
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span className="font-medium">{item.count}</span>
                <span className="text-muted-foreground ml-1">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}