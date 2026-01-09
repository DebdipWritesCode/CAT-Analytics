"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LineChart from "@/components/charts/LineChart";
import RadarChart from "@/components/charts/RadarChart";

interface MockReflectionProps {
  data: SheetData;
}

export default function MockReflection({ data }: MockReflectionProps) {
  const reflectionData = data.Mock_Reflection;

  // Prepare data for Line Chart: Stress vs Percentile
  const stressVsPercentile = reflectionData.map((reflection) => {
    const mock = data.Mock_Overview.find((m) => m.mockNo === reflection.mockNo);
    return {
      mockNo: reflection.mockNo,
      stress: reflection.stressLevel,
      percentile: mock?.overallPercentile || 0,
    };
  });

  // Prepare data for Radar Chart: Focus, Confidence, Calmness
  const radarData = reflectionData.map((reflection) => ({
    subject: `Mock ${reflection.mockNo}`,
    Focus: reflection.focusLevel,
    Confidence: reflection.confidenceAfterMock,
    Calmness: 10 - reflection.stressLevel, // Inverse of stress as calmness
  }));

  // Create radar series
  const radarSeries = [
    {
      name: "Focus",
      data: reflectionData.map((r) => ({
        subject: `Mock ${r.mockNo}`,
        value: r.focusLevel,
      })),
      color: "hsl(var(--chart-1))",
    },
    {
      name: "Confidence",
      data: reflectionData.map((r) => ({
        subject: `Mock ${r.mockNo}`,
        value: r.confidenceAfterMock,
      })),
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Calmness",
      data: reflectionData.map((r) => ({
        subject: `Mock ${r.mockNo}`,
        value: 10 - r.stressLevel,
      })),
      color: "hsl(var(--chart-3))",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stress vs Percentile</CardTitle>
          <CardDescription>Relationship between stress levels and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={stressVsPercentile}
            xKey="mockNo"
            yKey="stress"
            xLabel="Mock No"
            yLabel="Stress Level"
            color="hsl(var(--chart-1))"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus, Confidence, and Calmness</CardTitle>
          <CardDescription>Multi-metric analysis across mocks</CardDescription>
        </CardHeader>
        <CardContent>
          <RadarChart series={radarSeries} height={400} />
        </CardContent>
      </Card>
    </div>
  );
}
