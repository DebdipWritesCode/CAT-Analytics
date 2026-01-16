"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/lib/colors";

interface LineData {
  name: string;
  color: string;
  dataKey: string;
}

interface MultiLineChartProps {
  data: any[];
  xKey: string;
  lines: LineData[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

export default function MultiLineChart({
  data,
  xKey,
  lines,
  xLabel,
  yLabel,
  height = 300,
}: MultiLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
