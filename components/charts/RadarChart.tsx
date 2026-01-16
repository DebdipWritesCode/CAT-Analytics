"use client";

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CHART_COLORS } from "@/lib/colors";

interface RadarData {
  subject: string;
  value: number;
  fullMark?: number;
}

interface RadarSeries {
  name: string;
  data: RadarData[];
  color: string;
}

interface RadarChartProps {
  series: RadarSeries[];
  height?: number;
}

export default function RadarChart({
  series,
  height = 400,
}: RadarChartProps) {
  // Combine all subjects from all series
  const allSubjects = Array.from(
    new Set(series.flatMap((s) => s.data.map((d) => d.subject)))
  );

  // Transform data for Recharts format
  const chartData = allSubjects.map((subject) => {
    const dataPoint: any = { subject };
    series.forEach((s) => {
      const value = s.data.find((d) => d.subject === subject)?.value || 0;
      dataPoint[s.name] = value;
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={chartData}>
        <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
        <PolarAngleAxis
          dataKey="subject"
          stroke="#9ca3af"
          tick={{ fill: "#e5e7eb" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
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
        {series.map((s) => (
          <Radar
            key={s.name}
            name={s.name}
            dataKey={s.name}
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.6}
          />
        ))}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
