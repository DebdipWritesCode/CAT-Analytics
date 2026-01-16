"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/lib/colors";

interface PieData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface PieChartProps {
  data: PieData[];
  colors?: string[];
  height?: number;
}

const DEFAULT_COLORS = CHART_COLORS.extended;

export default function PieChart({
  data,
  colors = DEFAULT_COLORS,
  height = 300,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data as any}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props: any) => {
            const name = props.name || '';
            const percent = props.percent || 0;
            return `${name}: ${(percent * 100).toFixed(0)}%`;
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend wrapperStyle={{ color: "#e5e7eb" }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
