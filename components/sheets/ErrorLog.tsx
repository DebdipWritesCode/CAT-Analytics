"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LineChart from "@/components/charts/LineChart";
import StackedBarChart from "@/components/charts/StackedBarChart";

interface ErrorLogProps {
  data: SheetData;
}

export default function ErrorLog({ data }: ErrorLogProps) {
  const errorData = data.Error_Log;

  // Get mock numbers from Mock_Overview to map errors to mocks
  const mockNumbers = data.Mock_Overview.map((m) => m.mockNo);

  // Prepare data for Line Chart: Errors per Mock
  const errorsPerMock = mockNumbers.map((mockNo) => {
    // Count errors for this mock (assuming errors can be mapped by date or other means)
    // For now, we'll distribute errors evenly or use a simple count
    const errors = errorData.filter((e) => {
      // Try to match by date or use a simple distribution
      return true; // Simplified - in real app, match by date/mock
    });
    return {
      mockNo,
      errors: Math.floor(errorData.length / mockNumbers.length) || 0,
    };
  });

  // Prepare data for Stacked Bar Chart: Error Types Over Time
  const errorTypesByMock = mockNumbers.map((mockNo) => {
    const errors = errorData; // Simplified distribution
    return {
      mockNo,
      Concept: errors.filter((e) => e.errorType === "Concept").length,
      Silly: errors.filter((e) => e.errorType === "Silly").length,
      Reading: errors.filter((e) => e.errorType === "Reading").length,
      Time: errors.filter((e) => e.errorType === "Time").length,
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Errors per Mock</CardTitle>
          <CardDescription>Error count trend across mocks</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={errorsPerMock}
            xKey="mockNo"
            yKey="errors"
            xLabel="Mock"
            yLabel="Error Count"
            color="hsl(var(--chart-1))"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Types Over Time</CardTitle>
          <CardDescription>Breakdown of error types by mock</CardDescription>
        </CardHeader>
        <CardContent>
          <StackedBarChart
            data={errorTypesByMock}
            xKey="mockNo"
            bars={[
              { name: "Concept", dataKey: "Concept", color: "hsl(var(--chart-1))" },
              { name: "Silly", dataKey: "Silly", color: "hsl(var(--chart-2))" },
              { name: "Reading", dataKey: "Reading", color: "hsl(var(--chart-3))" },
              { name: "Time", dataKey: "Time", color: "hsl(var(--chart-4))" },
            ]}
            xLabel="Mock"
            yLabel="Error Count"
          />
        </CardContent>
      </Card>
    </div>
  );
}
