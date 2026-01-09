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
  Cell,
} from "recharts";

interface ScatterData {
  x: number;
  y: number;
  color?: string;
  [key: string]: any;
}

interface ScatterPlotProps {
  data: ScatterData[];
  xKey: string;
  yKey: string;
  colorKey?: string;
  colors?: string[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

export default function ScatterPlot({
  data,
  xKey,
  yKey,
  colorKey,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
  xLabel,
  yLabel,
  height = 300,
}: ScatterPlotProps) {
  // Group data by color if colorKey is provided
  const groupedData = colorKey
    ? data.reduce((acc, item) => {
        const color = item[colorKey] || "default";
        if (!acc[color]) acc[color] = [];
        acc[color].push(item);
        return acc;
      }, {} as Record<string, ScatterData[]>)
    : { default: data };

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
        {Object.entries(groupedData).map(([key, groupData], index) => (
          <Scatter
            key={key}
            name={key}
            data={groupData}
            fill={colors[index % colors.length]}
          >
            {groupData.map((entry, i) => (
              <Cell 
                key={`cell-${i}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Scatter>
        ))}
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}
