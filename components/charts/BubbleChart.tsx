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
import { CHART_COLORS } from "@/lib/colors";

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
  colors = CHART_COLORS.primary.slice(0, 3),
}: BubbleChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis
          type="number"
          dataKey={xKey}
          label={{ value: xLabel, position: "insideBottom", offset: -5, fill: "#e5e7eb" }}
          stroke="#9ca3af"
          tick={{ fill: "#e5e7eb" }}
        />
        <YAxis
          type="number"
          dataKey={yKey}
          label={{ value: yLabel, angle: -90, position: "insideLeft", fill: "#e5e7eb" }}
          stroke="#9ca3af"
          tick={{ fill: "#e5e7eb" }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend wrapperStyle={{ color: "#e5e7eb" }} />
        <Scatter 
          name="Topics" 
          data={data} 
          fill={CHART_COLORS.primary[0]}
          shape={(props: any) => {
            const { cx, cy, payload } = props;
            const size = Math.sqrt(payload[sizeKey] || 1) * 3;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={size}
                fill={payload.color || CHART_COLORS.primary[0]}
                opacity={0.6}
              />
            );
          }}
        />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}
