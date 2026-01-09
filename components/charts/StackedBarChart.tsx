"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarData {
  name: string;
  dataKey: string;
  color: string;
}

interface StackedBarChartProps {
  data: any[];
  xKey: string;
  bars: BarData[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

export default function StackedBarChart({
  data,
  xKey,
  bars,
  xLabel,
  yLabel,
  height = 300,
}: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey={xKey}
          label={{ value: xLabel, position: "insideBottom", offset: -5 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          label={{ value: yLabel, angle: -90, position: "insideLeft" }}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            stackId="a"
            fill={bar.color}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
