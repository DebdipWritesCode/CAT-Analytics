"use client";

import { SheetData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BarChart from "@/components/charts/BarChart";
import ScatterPlot from "@/components/charts/ScatterPlot";

interface DILRSetSelectionLogProps {
  data: SheetData;
}

export default function DILRSetSelectionLog({ data }: DILRSetSelectionLogProps) {
  const dilrData = data.DILR_Set_Selection_Log;

  // Prepare data for Bar Chart: Solvable vs Attempted Sets
  const solvableVsAttempted = dilrData.reduce((acc, set) => {
    const mockNo = set.mockNo;
    if (!acc[mockNo]) {
      acc[mockNo] = { mockNo, solvable: 0, attempted: 0 };
    }
    if (set.wasSetSolvable) {
      acc[mockNo].solvable += 1;
    }
    if (set.questionsSolved > 0) {
      acc[mockNo].attempted += 1;
    }
    return acc;
  }, {} as Record<number, { mockNo: number; solvable: number; attempted: number }>);

  const solvableAttemptedData = Object.values(solvableVsAttempted);

  // Prepare data for Scatter Plot: Time Spent vs Questions Solved
  const scatterData = dilrData.map((set) => ({
    x: set.timeSpent,
    y: set.questionsSolved,
    solvable: set.wasSetSolvable,
    color: set.wasSetSolvable
      ? "hsl(var(--chart-1))"
      : "hsl(var(--chart-2))",
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Solvable vs Attempted Sets</CardTitle>
          <CardDescription>Set selection analysis by mock</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={solvableAttemptedData}
            xKey="mockNo"
            bars={[
              { name: "Solvable", dataKey: "solvable", color: "hsl(var(--chart-1))" },
              { name: "Attempted", dataKey: "attempted", color: "hsl(var(--chart-2))" },
            ]}
            xLabel="Mock"
            yLabel="Count"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Spent vs Questions Solved</CardTitle>
          <CardDescription>Efficiency analysis of set solving</CardDescription>
        </CardHeader>
        <CardContent>
          <ScatterPlot
            data={scatterData}
            xKey="x"
            yKey="y"
            colorKey="solvable"
            xLabel="Time Spent (seconds)"
            yLabel="Questions Solved"
            colors={["hsl(var(--chart-1))", "hsl(var(--chart-2))"]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
