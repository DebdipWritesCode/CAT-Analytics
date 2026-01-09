"use client";

import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BubbleData {
  x: number;
  y: number;
  z: number; // size
  name?: string;
  color?: string;
}

interface BubbleChartProps {
  data: BubbleData[];
  xKey: string;
  yKey: string;
  sizeKey: string;
  xLabel?: string;
  yLabel?: string;
  height?: number;
  colors?: string[];
}

export default function BubbleChart({
  data,
  xKey,
  yKey,
  sizeKey,
  xLabel,
  yLabel,
  height = 300,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
}: BubbleChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          dataKey={xKey}
          label={{ value: xLabel, position: "insideBottom", offset: -5 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          type="number"
          dataKey={yKey}
          label={{ value: yLabel, angle: -90, position: "insideLeft" }}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        <Scatter 
          name="Topics" 
          data={data} 
          fill="hsl(var(--chart-1))"
          shape={(props: any) => {
            const { cx, cy, payload } = props;
            const size = Math.sqrt(payload[sizeKey] || 1) * 3;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={size}
                fill={payload.color || "hsl(var(--chart-1))"}
                opacity={0.6}
              />
            );
          }}
        />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}
