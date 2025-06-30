"use client";

import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsChartProps {
  data: Array<{
    date: string;
    signups: number;
    revenue: number;
  }>;
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(0)}`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={formatDate}
        />
        <YAxis 
          yAxisId="left"
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={formatCurrency}
        />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                  <p className="font-medium">{formatDate(label)}</p>
                  <div className="space-y-1 mt-2">
                    {payload.map((entry, index) => (
                      <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.name === 'Revenue' ? formatCurrency(entry.value as number) : entry.value}
                      </p>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          yAxisId="left"
          dataKey="signups"
          name="Signups"
          fill="hsl(var(--chart-1))"
          opacity={0.8}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
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