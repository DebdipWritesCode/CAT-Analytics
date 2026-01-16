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
import { CHART_COLORS } from "@/lib/colors";

interface BarData {
  name: string;
  dataKey: string;
  color: string;
}

interface BarChartProps {
  data: any[];
  xKey: string;
  bars: BarData[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

export default function BarChart({
  data,
  xKey,
  bars,
  xLabel,
  yLabel,
  height = 300,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis
          dataKey={xKey}
          label={{ value: xLabel, position: "insideBottom", offset: -5, fill: "#e5e7eb" }}
          stroke="#9ca3af"
          tick={{ fill: "#e5e7eb" }}
        />
        <YAxis
          label={{ value: yLabel, angle: -90, position: "insideLeft", fill: "#e5e7eb" }}
          stroke="#9ca3af"
          tick={{ fill: "#e5e7eb" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend wrapperStyle={{ color: "#e5e7eb" }} />
        {bars.map((bar) => (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} name={bar.name} fill={bar.color} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
