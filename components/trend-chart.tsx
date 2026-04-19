"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TrendChart({
  data,
  color = "#2540f5",
}: {
  data: { date: string; score: number }[];
  color?: string;
}) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eef2f7" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            tick={{ fontSize: 11 }}
            domain={[0, 100]}
          />
          <Tooltip
            cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 6px 20px -6px rgba(16,24,40,0.12)",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={2.4}
            fill="url(#trendFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
