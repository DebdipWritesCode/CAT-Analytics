"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LineChart from "@/components/charts/LineChart";
import MultiLineChart from "@/components/charts/MultiLineChart";
import BarChart from "@/components/charts/BarChart";

interface MockOverviewProps {
  data: SheetData;
}

export default function MockOverview({ data }: MockOverviewProps) {
  const mockData = data.Mock_Overview;

  // Prepare data for Overall Percentile Trend
  const percentileTrend = mockData.map((mock) => ({
    mockNo: mock.mockNo,
    date: mock.date,
    percentile: mock.overallPercentile,
  }));

  // Prepare data for Section-wise Percentile
  const sectionPercentile = mockData.map((mock) => ({
    mockNo: mock.mockNo,
    "VARC %ile": mock.varcPercentile,
    "DILR %ile": mock.dilrPercentile,
    "QA %ile": mock.qaPercentile,
  }));

  // Prepare data for Attempts vs Accuracy
  const attemptsAccuracy = [
    {
      section: "VARC",
      Attempts: mockData.reduce((sum, m) => sum + m.attemptsVARC, 0) / mockData.length,
      Correct: mockData.reduce((sum, m) => sum + (m.attemptsVARC * m.accuracyVARC / 100), 0) / mockData.length,
    },
    {
      section: "DILR",
      Attempts: mockData.reduce((sum, m) => sum + m.attemptsDILR, 0) / mockData.length,
      Correct: mockData.reduce((sum, m) => sum + (m.attemptsDILR * m.accuracyDILR / 100), 0) / mockData.length,
    },
    {
      section: "QA",
      Attempts: mockData.reduce((sum, m) => sum + m.attemptsQA, 0) / mockData.length,
      Correct: mockData.reduce((sum, m) => sum + (m.attemptsQA * m.accuracyQA / 100), 0) / mockData.length,
    },
  ];

  if (mockData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Percentile Trend</CardTitle>
          <CardDescription>Your percentile progression over time</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={percentileTrend}
            xKey="mockNo"
            yKey="percentile"
            xLabel="Mock No"
            yLabel="Overall Percentile"
            color="hsl(var(--chart-1))"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Section-wise Percentile</CardTitle>
          <CardDescription>Comparison of VARC, DILR, and QA percentiles</CardDescription>
        </CardHeader>
        <CardContent>
          <MultiLineChart
            data={sectionPercentile}
            xKey="mockNo"
            lines={[
              { name: "VARC %ile", dataKey: "VARC %ile", color: "hsl(var(--chart-1))" },
              { name: "DILR %ile", dataKey: "DILR %ile", color: "hsl(var(--chart-2))" },
              { name: "QA %ile", dataKey: "QA %ile", color: "hsl(var(--chart-3))" },
            ]}
            xLabel="Mock No"
            yLabel="Percentile"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attempts vs Accuracy (per section)</CardTitle>
          <CardDescription>Average attempts and correct answers by section</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={attemptsAccuracy}
            xKey="section"
            bars={[
              { name: "Attempts", dataKey: "Attempts", color: "hsl(var(--chart-1))" },
              { name: "Correct", dataKey: "Correct", color: "hsl(var(--chart-2))" },
            ]}
            xLabel="Section"
            yLabel="Count"
          />
        </CardContent>
      </Card>
    </div>
  );
}
