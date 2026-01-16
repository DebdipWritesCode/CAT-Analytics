"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import { CHART_COLORS } from "@/lib/colors";

interface ErrorLogProps {
  data: SheetData;
}

export default function ErrorLog({ data }: ErrorLogProps) {
  const errorData = data.Error_Log;

  if (errorData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No error data available</p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to normalize date formats for matching
  const normalizeDate = (date: string): string => {
    return date.trim().replace(/\s+/g, " ");
  };

  // Create a map of dates to mock numbers from Mock_Overview
  const dateToMockMap = new Map<string, number>();
  data.Mock_Overview.forEach((mock) => {
    if (mock.date) {
      const normalizedDate = normalizeDate(mock.date);
      dateToMockMap.set(normalizedDate, mock.mockNo);
    }
  });

  // Group errors by mock number based on date matching
  const errorsByMock = new Map<number, typeof errorData>();
  const unmatchedErrors: typeof errorData = [];

  errorData.forEach((error) => {
    const normalizedErrorDate = normalizeDate(error.date);
    const mockNo = dateToMockMap.get(normalizedErrorDate);
    
    if (mockNo !== undefined) {
      if (!errorsByMock.has(mockNo)) {
        errorsByMock.set(mockNo, []);
      }
      errorsByMock.get(mockNo)!.push(error);
    } else {
      unmatchedErrors.push(error);
    }
  });

  // Get all unique mock numbers
  const allMockNumbers = Array.from(
    new Set([
      ...data.Mock_Overview.map((m) => m.mockNo),
      ...Array.from(errorsByMock.keys()),
    ])
  ).sort((a, b) => a - b);

  // If we have unmatched errors and no matched errors, create a single "All Errors" entry
  if (errorsByMock.size === 0 && unmatchedErrors.length > 0) {
    allMockNumbers.push(0); // Use 0 as a placeholder for "All"
    errorsByMock.set(0, unmatchedErrors);
  }

  // Prepare data for Line Chart: Errors per Mock
  const errorsPerMock = allMockNumbers.map((mockNo) => {
    const errors = errorsByMock.get(mockNo) || [];
    return {
      mockNo: mockNo === 0 ? 1 : mockNo, // Display as 1 if it's the "All" placeholder
      errors: errors.length,
    };
  });

  // Prepare data for Bar Chart: Error Types (aggregated across all mocks)
  const errorTypeCounts = errorData.reduce((acc, error) => {
    const type = error.errorType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Define error type order and colors
  const errorTypeConfig = [
    { name: "Concept", key: "Concept", color: CHART_COLORS.stacked.concept },
    { name: "Reading", key: "Reading", color: CHART_COLORS.stacked.reading },
    { name: "Silly", key: "Silly", color: CHART_COLORS.stacked.silly },
    { name: "Time", key: "Time", color: CHART_COLORS.secondary[2] }, // Teal/Green for Time
    { name: "Guess", key: "Guess", color: CHART_COLORS.secondary[1] }, // Pink for Guess
  ];

  const errorTypesData = errorTypeConfig
    .filter((config) => errorTypeCounts[config.key] !== undefined)
    .map((config) => ({
      errorType: config.name,
      count: errorTypeCounts[config.key] || 0,
      color: config.color, // Add color to each data point
    }));

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
            color={CHART_COLORS.primary[0]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Types Distribution</CardTitle>
          <CardDescription>Breakdown of error types across all mocks</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={errorTypesData}
            xKey="errorType"
            bars={[
              { name: "Count", dataKey: "count", color: CHART_COLORS.primary[0] },
            ]}
            xLabel="Error Type"
            yLabel="Count"
          />
        </CardContent>
      </Card>
    </div>
  );
}
